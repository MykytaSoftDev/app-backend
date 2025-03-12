import { Injectable } from '@nestjs/common'
import { createHash } from 'crypto'
import { PageService } from 'src/modules/page/page.service'
import { PrismaService } from 'src/prisma.service'
import { DeeplService } from 'src/services/translation.services/deepl.service'
import { WordCounterService } from 'src/services/wordcounter.service'
import { ProjectService } from '../project/project.service'
import { UserService } from '../user/user.service'
import { TranslationApiDto } from './dto/translation.api.dto'
import { TranslationDto } from './dto/translation.dto'
import { GoogleService } from 'src/services/translation.services/google.service'
import { LanguageCode } from 'deepl-node'

@Injectable()
export class TranslationService {
	constructor(
		private prisma: PrismaService,
		private deeplService: DeeplService,
		private googleService: GoogleService,
		private pageService: PageService,
		private projectService: ProjectService,
		private wordCounterService: WordCounterService,
	) {}

	async create(
		dto: TranslationDto,
		userId: string,
		projectId: string,
		pageId: string,
	) {
		return this.prisma.translation.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
				project: {
					connect: {
						id: projectId,
					},
				},
				page: {
					connect: {
						id: pageId,
					},
				},
			},
		})
	}

	async translate(dto: TranslationApiDto) {
		const {
			segments,
			referrer,
			projectKey,
			sourceLanguageCode,
			targetLanguageCode,
		} = dto
		const project = await this.projectService.getProjectByProjectKey(projectKey)

		if (!project) return { error: 'Project not found' }

		const pagePath = atob(dto.referrer)

		let page = await this.pageService.getPageByPath(
			project.userId,
			project.id,
			pagePath,
			targetLanguageCode,
		)

		if (!page) {
			return await this.createTranslation(dto, project.userId, project.id)
		}

		const translatedSegments = await this.getTranslations(
			project.userId,
			project.id,
			page.id,
			targetLanguageCode,
			segments,
		)

		const filteredTranslatedSegments = translatedSegments.filter(el => {
			if (el.translatedText) return el
		})

		if (filteredTranslatedSegments.length !== segments.length) {
			const newTranslations = await this.updateTranslations(
				dto,
				project.userId,
				project.id,
				page.id,
			)

			return newTranslations
		}

		return translatedSegments
	}

	async getTranslations(
		userId: string,
		projectId: string,
		pageId: string,
		targetLanguage: string,
		segments: string[],
	) {
		const hashedSegments = await Promise.all(
			segments.map(async segment => ({
				text: segment,
				hash: await this.createSourceHash(segment),
			})),
		)
		const segmentHashes = hashedSegments.map(({ hash }) => hash)

		const existingTranslations = await this.prisma.translation.findMany({
			select: {
				sourceHash: true,
				translatedText: true,
			},
			where: {
				userId,
				projectId,
				pageId,
				targetLanguage,
				sourceHash: { in: segmentHashes },
			},
		})

		const translationMap = new Map(
			existingTranslations.map(t => [t.sourceHash, t.translatedText]),
		)

		return hashedSegments.map(({ hash, text }) => ({
			sourceText: text,
			hashedSourceText: hash,
			translatedText: translationMap.get(hash) || '', // Return empty if not found
		}))
	}

	async createTranslation(
		dto: Partial<TranslationApiDto>,
		userId: string,
		projectId: string,
	) {
		const pagePath = atob(dto.referrer)

		// Calculate words count for all segments
		const wordsCount = await this.wordCounterService.calculateWords(
			dto.segments,
		)

		const supportedTranslationService = await this.getSupportedService(
			dto.sourceLanguageCode,
			dto.targetLanguageCode,
		)

		const newPage = await this.pageService.create(
			{
				pageUrl: pagePath,
				targetLanguage: dto.targetLanguageCode,
				wordsCount: wordsCount,
			},
			userId,
			projectId,
		)

		// Translating segments
		const translationTasks = dto.segments.map(async segment => {
			try {
				const translationService =
					supportedTranslationService === 'deepl'
						? this.deeplService
						: this.googleService

				const translatedText = await translationService.translate(
					segment,
					dto.sourceLanguageCode,
					dto.targetLanguageCode,
				)

				return {
					sourceLanguage: dto.sourceLanguageCode,
					targetLanguage: dto.targetLanguageCode,
					sourceText: segment,
					translatedText,
					sourceHash: await this.createSourceHash(segment),
				}
			} catch (error) {
				console.error(`Translation failed for segment: ${segment}`, error)
				return null
			}
		})

		const translations = (await Promise.all(translationTasks)).filter(Boolean)
		// Saving...
		await this.prisma.translation.createMany({
			data: translations.map(translation => ({
				userId,
				projectId,
				pageId: newPage.id,
				sourceLanguage: translation.sourceLanguage,
				targetLanguage: translation.targetLanguage,
				sourceText: translation.sourceText,
				translatedText: translation.translatedText,
				sourceHash: translation.sourceHash,
			})),
			skipDuplicates: true,
		})

		await this.wordCounterService.recountProjectWords(userId, projectId)

		return translations
	}

	async updateTranslations(
		dto: TranslationApiDto,
		userId: string,
		projectId: string,
		pageId: string,
	) {
		const { segments, sourceLanguageCode, targetLanguageCode } = dto
		console.log('updateTranslations, segments:', segments.length)

		// Хеширование всех сегментов
		const hashedSegments = await Promise.all(
			segments.map(async segment => ({
				text: segment,
				hash: await this.createSourceHash(segment),
			})),
		)
		console.log('updateTranslations, hashedSegments:', hashedSegments.length)

		// Получение текущих переводов из БД
		const existingTranslations = await this.prisma.translation.findMany({
			where: { userId, projectId, pageId, targetLanguage: targetLanguageCode },
			select: {
				id: true,
				sourceHash: true,
				sourceText: true,
				translatedText: true,
			},
		})
		console.log(
			'updateTranslations, existingTranslations:',
			existingTranslations.length,
		)

		// Создаем мапу уже существующих переводов { hash -> перевод }
		const translationMap = new Map(
			existingTranslations.map(t => [t.sourceHash, t.translatedText]),
		)

		// Определяем хеши всех сегментов
		const allHashes = new Set(hashedSegments.map(segment => segment.hash))
		const existingHashes = new Set(existingTranslations.map(t => t.sourceHash))

		// Определяем новые и устаревшие сегменты
		const newSegments = hashedSegments.filter(
			segment => !existingHashes.has(segment.hash),
		)
		const unusedTranslations = existingTranslations.filter(
			t => !allHashes.has(t.sourceHash),
		)

		console.log('updateTranslations, newSegments.length:', newSegments.length)
		console.log(
			'updateTranslations, unusedTranslations.length:',
			unusedTranslations.length,
		)

		// Удаляем устаревшие переводы
		if (unusedTranslations.length > 0) {
			const unusedIds = unusedTranslations.map(t => t.id)
			await this.prisma.translation.deleteMany({
				where: { id: { in: unusedIds } },
			})
		}

		// Если нет новых сегментов, просто возвращаем уже существующие переводы в порядке входных сегментов
		if (newSegments.length === 0) {
			return hashedSegments.map(({ hash, text }) => ({
				sourceText: text,
				hashedSourceText: hash,
				translatedText: translationMap.get(hash) || '',
			}))
		}

		// Определяем сервис перевода (DeepL или Google)
		const supportedTranslationService = await this.getSupportedService(
			sourceLanguageCode,
			targetLanguageCode,
		)

		// Перевод новых сегментов
		const translationTasks = newSegments.map(async segment => {
			try {
				const translationService =
					supportedTranslationService === 'deepl'
						? this.deeplService
						: this.googleService

				const translatedText = await translationService.translate(
					segment.text,
					sourceLanguageCode,
					targetLanguageCode,
				)

				// Сохраняем перевод в мапу
				translationMap.set(segment.hash, translatedText)

				return {
					sourceLanguage: sourceLanguageCode,
					targetLanguage: targetLanguageCode,
					sourceText: segment.text,
					translatedText,
					sourceHash: segment.hash,
				}
			} catch (error) {
				console.error(`Translation failed for segment: ${segment.text}`, error)
				return null
			}
		})

		const newTranslations = (await Promise.all(translationTasks)).filter(
			Boolean,
		)

		// Сохраняем новые переводы в БД
		await this.prisma.translation.createMany({
			data: newTranslations.map(translation => ({
				userId,
				projectId,
				pageId,
				sourceLanguage: translation.sourceLanguage,
				targetLanguage: translation.targetLanguage,
				sourceText: translation.sourceText,
				translatedText: translation.translatedText,
				sourceHash: translation.sourceHash,
			})),
			skipDuplicates: true,
		})

		await this.wordCounterService.updateWordsCount(
			segments,
			userId,
			projectId,
			pageId,
		)

		// Возвращаем переводы в порядке входных сегментов, используя translationMap
		return hashedSegments.map(({ hash, text }) => ({
			sourceText: text,
			hashedSourceText: hash,
			translatedText: translationMap.get(hash) || '',
		}))
	}

	async getSupportedService(
		sourceLanguageCode: string,
		targetLanguageCode: string,
	) {
		const supportedLanguages = await this.deeplService.getSourceLanguages()
		const supportedTargetLanguages =
			await this.deeplService.getTargetLanguages()

		return supportedLanguages.includes(sourceLanguageCode as LanguageCode) &&
			supportedTargetLanguages.includes(targetLanguageCode)
			? 'deepl'
			: 'google'
	}

	async createSourceHash(segment: string) {
		return createHash('sha256').update(segment).digest('hex')
	}
}
