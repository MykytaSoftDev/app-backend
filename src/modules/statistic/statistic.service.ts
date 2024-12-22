import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateStatisticDto, StatisticDto } from './dto/statistic.dto'
import { ProjectService } from '../project/project.service'
import { decodeFromBase64 } from 'src/helpers/dev.helper'
import { PageService } from '../page/page.service'

@Injectable()
export class StatisticService {
	constructor(
		private prisma: PrismaService,
		private projectService: ProjectService,
		private pageService: PageService,
	) {}

	async create(dto: CreateStatisticDto) {
		return await this.prisma.userStatistic.create({
			data: {
				targetLanguage: dto.targetLanguage,
				views: 1,
				user: {
					connect: {
						id: dto.userId,
					},
				},
				project: {
					connect: {
						id: dto.projectId,
					},
				},
				page: {
					connect: {
						id: dto.pageId,
					},
				},
			},
		})
	}

	async updateViews(statisticId: string, views: number) {
		return this.prisma.userStatistic.update({
			where: {
				id: statisticId,
			},
			data: {
				views: views,
			},
		})
	}

	async getStatistic(dto: StatisticDto) {
		const user = await this.prisma.user.findFirst({
			where: {
				apiKey: dto.apiKey,
			},
		})

		if (!user)
			throw new NotFoundException('User was not found by provided apiKey')

		const project = await this.projectService.getProjectById(dto.projectId)

		if (!project) throw new NotFoundException('Project was not found')

		const decodedReferrer = await decodeFromBase64(dto.referrer)

		const page = await this.pageService.getPageByPath(
			user.id,
			project.id,
			decodedReferrer,
			dto.targetLanguage,
		)

		if (!page) throw new NotFoundException('There is no page yet')

		const startOfToday = new Date()
		startOfToday.setHours(0, 0, 0, 0)

		const statistic = await this.prisma.userStatistic.findFirst({
			where: {
				userId: user.id,
				projectId: project.id,
				pageId: page.id,
				targetLanguage: dto.targetLanguage,
				createdAt: {
					gte: startOfToday,
				},
			},
		})

		return { user, project, page, statistic }
	}
}
