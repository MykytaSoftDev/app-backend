import { Injectable } from '@nestjs/common'
import { createHash } from 'crypto'
import * as _ from 'lodash/string'
import { PageService } from 'src/page/page.service'
import { PrismaService } from 'src/prisma.service'
import { DeeplService } from 'src/services/deepl.service'
import { TranslationDto } from './translation.dto'

@Injectable()
export class TranslationService {
	constructor(
		private prisma: PrismaService,
		private deeplService: DeeplService,
		private pageService: PageService,
	) {}

	async create(
		dto: TranslationDto,
		userId: string,
		domainId: string,
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
				domain: {
					connect: {
						id: domainId,
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

	async translate(
		dto: TranslationDto,
		userId: string,
		domainId: string,
		pageId: string,
	) {
		const { segments, ...data } = dto;

		// Calculate words count for all segments
		const wordsCount = segments.reduce((count, el) => count + _.words(el).length, 0);

		// Translate all segments in parallel
		const translationPromises = segments.map(async (segment) => {
			const translatedText = await this.deeplService.translate(
				segment,
				dto.sourceLanguage,
				dto.targetLanguage,
			);

			return {
				...data,
				sourceText: segment,
				translatedText,
				sourceHash: createHash('sha256').update(segment).digest('hex'),
			};
		});

		// Wait for all translations to complete
		const translations = await Promise.all(translationPromises);

		// Batch save translations to reduce database writes
		await Promise.all(
			translations.map((translation) =>
				this.create(translation, userId, domainId, pageId),
			),
		);

		// Update the words count for the page
		await this.pageService.update(
			{ wordsCount },
			pageId,
			userId,
			domainId,
		);
	}


}
