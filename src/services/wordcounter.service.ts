import { Injectable } from '@nestjs/common'
import { ProjectService } from 'src/modules/project/project.service'
import { PrismaService } from 'src/prisma.service'
import * as _ from 'lodash/string'
import { PageService } from 'src/modules/page/page.service'

@Injectable()
export class WordCounterService {
	constructor(
		private prisma: PrismaService,
		private projectService: ProjectService,
		private pageService: PageService,
	) {}

	async recountProjectWords(userId: string, projectId: string) {
		const totalWordCount = await this.prisma.page.aggregate({
			where: {
				userId: userId,
				projectId: projectId,
				isExcluded: {
					not: true,
				},
			},
			_sum: {
				wordsCount: true,
			},
		})

		await this.projectService.update(
			{ wordsCount: totalWordCount._sum.wordsCount },
			projectId,
			userId,
		)
	}

	async calculateWords(segments: string[]) {
		const wordsCount = segments.reduce((count, el) => {
			// Remove HTML tags
			const cleanedSegment = el.replace(/<\/?[^>]+(>|$)/g, '')
			const wordCountInSegment = _.words(cleanedSegment).length

			return count + wordCountInSegment
		}, 0)

		return wordsCount
	}

	async updateWordsCount(
		segments: string[],
		userId: string,
		projectId: string,
		pageId: string,
	) {
		const wordsCount = await this.calculateWords(segments)

		await this.pageService.update(
			{ wordsCount: wordsCount },
			pageId,
			userId,
			projectId,
		)

		await this.recountProjectWords(userId, projectId)
	}
}
