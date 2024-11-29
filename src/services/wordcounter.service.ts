import { Injectable } from '@nestjs/common'
import { ProjectService } from 'src/modules/project/project.service'
import { PrismaService } from 'src/prisma.service'
import * as _ from 'lodash/string'

@Injectable()
export class WordCounterService {
	constructor(
		private prisma: PrismaService,
		private projectService: ProjectService,
	) {}

	async recountProjectWords(userId: string, projectId: string) {
		const totalWordCount = await this.prisma.page.aggregate({
			where: {
				userId: userId,
				projectId: projectId,
			},
			_sum: {
				wordsCount: true,
			},
		})

		console.log(`Total Word Count: ${totalWordCount._sum.wordsCount || 0}`)

		await this.projectService.update(
			{ wordsCount: totalWordCount._sum.wordsCount },
			projectId,
			userId,
		)
	}

	async calculateWords(segments: string[]) {
		const wordsCount = segments.reduce(
			(count, el) => count + _.words(el).length,
			0,
		)

		return wordsCount
	}
}
