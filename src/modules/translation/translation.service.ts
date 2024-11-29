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
import { decodeFromBase64 } from '../../helpers/dev.helper'

@Injectable()
export class TranslationService {
	constructor(
		private prisma: PrismaService,
		private deeplService: DeeplService,
		private pageService: PageService,
		private projectService: ProjectService,
		private wordCounterService: WordCounterService,
		private userService: UserService,
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

	async translate(dto: TranslationApiDto, projectId: string) {
		const {
			segments,
			referrer,
			apiKey,
			sourceLanguageCode,
			targetLanguageCode,
		} = dto

		const user = await this.userService.getUserByApiKey(apiKey)

		if (!user) return { error: 'User not found' }

		const project = await this.projectService.getProjectById(projectId)

		if (!project) return { error: 'Project not found' }

		const pagePath = await decodeFromBase64(dto.referrer)

		let page = await this.pageService.getPageByPath(
			user.id,
			projectId,
			pagePath,
			targetLanguageCode,
		)

		if (!page) {
			return await this.createTranslation(dto, user.id, project.id)
		}

		const translatedSegments = await this.getTranslations(
			user.id,
			project.id,
			page.id,
			targetLanguageCode,
		)

		if (translatedSegments.length !== segments.length) {
			const newTranslations = await this.updateTranslations(
				dto,
				user.id,
				project.id,
				page.id,
			)

			return [...translatedSegments, ...newTranslations]
		}

		return translatedSegments
	}

	async getTranslations(
		userId: string,
		projectId: string,
		pageId: string,
		targetLanguage: string,
	) {
		return this.prisma.translation.findMany({
			select: {
				sourceText: true,
				translatedText: true,
			},
			where: {
				userId,
				projectId,
				pageId,
				targetLanguage,
			},
		})
	}

	async createTranslation(
		dto: Partial<TranslationApiDto>,
		userId: string,
		projectId: string,
	) {
		const pagePath = await decodeFromBase64(dto.referrer)

		// Calculate words count for all segments
		const wordsCount = await this.wordCounterService.calculateWords(
			dto.segments,
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
				const translatedText = await this.deeplService.translate(
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

		// Generate hash for new segments
		const hashedSegments = await Promise.all(
			segments.map(async segment => ({
				text: segment,
				hash: await this.createSourceHash(segment),
			})),
		)

		// Getting current translations
		const existingTranslations = await this.prisma.translation.findMany({
			select: { sourceHash: true },
			where: { userId, projectId, pageId, targetLanguage: targetLanguageCode },
		})

		const existingHashes = new Set(existingTranslations.map(t => t.sourceHash))

		// Getting segments which are new
		const newSegments = hashedSegments.filter(
			segment => !existingHashes.has(segment.hash),
		)

		// if there is no new segments
		if (newSegments.length === 0) return []

		// Translation of new segments
		const translationTasks = newSegments.map(async segment => {
			try {
				const translatedText = await this.deeplService.translate(
					segment.text,
					sourceLanguageCode,
					targetLanguageCode,
				)

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

		// Saving
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
		})

		// Calculate words count for all segments
		const wordsCount = await this.wordCounterService.calculateWords(
			dto.segments,
		)

		await this.pageService.update(
			{ wordsCount: wordsCount },
			pageId,
			userId,
			projectId,
		)
		await this.wordCounterService.recountProjectWords(userId, projectId)

		return newTranslations
	}

	async createSourceHash(segment: string) {
		return createHash('sha256').update(segment).digest('hex')
	}
}
