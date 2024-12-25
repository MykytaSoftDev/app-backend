import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateStatisticDto, StatisticDto } from './dto/statistic.dto'
import { ProjectService } from '../project/project.service'
import { decodeFromBase64 } from 'src/helpers/dev.helper'
import { PageService } from '../page/page.service'
import { LanguageService } from 'src/services/language.service'

@Injectable()
export class StatisticService {
	constructor(
		private prisma: PrismaService,
		private projectService: ProjectService,
		private pageService: PageService,
		private languageService: LanguageService,
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

	async getViewsStatistic(
		userId: string,
		language: string,
		period: 'last7Days' | 'month' | 'lastMonth',
	) {
		// Calculate date range based on the selected period
		const startDate = (() => {
			const now = new Date()
			if (period === 'last7Days') {
				// Start of the last 7 days
				const sevenDaysAgo = new Date(now)
				sevenDaysAgo.setDate(now.getDate() - 6) // Include today
				sevenDaysAgo.setHours(0, 0, 0, 0)
				return sevenDaysAgo
			} else if (period === 'month') {
				// Start of the current month
				return new Date(now.getFullYear(), now.getMonth(), 1)
			} else if (period === 'lastMonth') {
				// Start and end of the previous month
				return new Date(now.getFullYear(), now.getMonth() - 1, 1)
			}
		})()

		const endDate = (() => {
			if (period === 'lastMonth') {
				// End of the previous month
				return new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
			}
			return new Date() // Now for 'last7Days' and 'month'
		})()

		// Fetch statistics from the database for the given date range
		const statistics = await this.prisma.userStatistic.findMany({
			where: {
				userId,
				targetLanguage: language,
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
			},
			select: {
				targetLanguage: true,
				createdAt: true,
				views: true,
			},
		})

		// Group data by day
		const dailyStats = statistics.reduce((acc, stat) => {
			const dateKey = stat.createdAt.toISOString().split('T')[0] // Convert to YYYY-MM-DD
			if (!acc[dateKey]) {
				acc[dateKey] = 0 // Initialize views for the day
			}
			acc[dateKey] += stat.views // Sum views for the day
			return acc
		}, {})

		// Create an array of all dates in the selected range
		const allDatesInRange = []
		let currentDate = new Date(startDate)
		while (currentDate <= endDate) {
			allDatesInRange.push(currentDate.toISOString().split('T')[0]) // Add date in YYYY-MM-DD format
			currentDate.setDate(currentDate.getDate() + 1) // Move to the next day
		}

		// Fill missing days with 0 views
		const periodData = allDatesInRange
		const views = periodData.map(date => dailyStats[date] || 0)

		// Get the language title
		const languageTitle = await this.languageService
			.getObjectByCode2(language)
			.then(lang => lang.title)

		// Form the final grouped statistics object
		const groupedStatistics = {
			language: languageTitle,
			period: periodData,
			views,
		}

		return groupedStatistics
	}
}
