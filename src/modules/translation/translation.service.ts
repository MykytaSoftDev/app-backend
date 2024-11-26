import { Injectable } from '@nestjs/common'
import { createHash } from 'crypto'
import * as _ from 'lodash/string'
import { PageService } from 'src/modules/page/page.service'
import { PrismaService } from 'src/prisma.service'
import { DeeplService } from 'src/services/translation.services/deepl.service'
import { WordCounterService } from 'src/services/wordcounter.service'
import { ProjectService } from '../project/project.service'
import { UserService } from '../user/user.service'
import { TranslationApiDto } from './dto/translation.api.dto'
import { TranslationDto } from './dto/translation.dto'

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
		console.log('segments', segments)
		console.log('referrer', referrer)
		console.log('apiKey', apiKey)
		console.log('sourceLanguageCode', sourceLanguageCode)
		console.log('targetLanguageCode', targetLanguageCode)

		const user = await this.userService.getUserByApiKey(apiKey)

		if (!user) return { error: 'User not found' }

		const project = await this.projectService.getProjectById(projectId)

		if (!project) return { error: 'Project not found' }

		const decodedReferrer = await this.decodeFromBase64(referrer)
		let page = await this.pageService.getPageByPath(
			user.id,
			projectId,
			decodedReferrer,
			targetLanguageCode,
		)
		console.log('page1', page)

		// Calculate words count for all segments
		const wordsCount = segments.reduce(
			(count, el) => count + _.words(el).length,
			0,
		)
		if (!page) {
			const newPage = await this.pageService.create(
				{
					pageUrl: decodedReferrer,
					targetLanguage: targetLanguageCode,
					wordsCount: wordsCount,
				},
				user.id,
				projectId,
			)

			// Translate all segments in parallel
			const translationPromises = segments.map(async segment => {
				const translatedText = await this.deeplService.translate(
					segment,
					sourceLanguageCode,
					targetLanguageCode,
				)

				return {
					sourceLanguage: sourceLanguageCode,
					targetLanguage: targetLanguageCode,
					sourceText: segment,
					translatedText,
					sourceHash: await this.createSourceHash(segment),
				}
			})

			// Wait for all translations to complete
			const translations = await Promise.all(translationPromises)

			// Batch save translations to reduce database writes
			await Promise.all(
				translations.map(translation =>
					this.create(translation, user.id, projectId, newPage.id),
				),
			)

			// Update the words count for the page
			// await this.pageService.update({ wordsCount }, newPage.id, userId, projectId	)
			await this.wordCounterService.recountProjectWords(user.id, projectId)

			return translations
		}

		const translatedSegments = await this.getTranslations(
			user.id,
			project.id,
			page.id,
			targetLanguageCode,
		)
		console.log(translatedSegments)
		if (translatedSegments.length !== segments.length)
			return await this.updateTranslations(segments)

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

	async updateTranslations(segments: string[]) {
		return
	}

	async decodeFromBase64(referrer: string) {
		const binStr = atob(referrer)
		const u8 = new Uint8Array(binStr.length)
		for (let i = 0; i < binStr.length; i++) {
			u8[i] = binStr.charCodeAt(i)
		}
		return new TextDecoder().decode(u8)
	}

	async createSourceHash(segment: string) {
		return createHash('sha256').update(segment).digest('hex')
	}
}
