import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { StatisticDto } from './dto/statistic.dto'
import { StatisticService } from './statistic.service'

@Controller({ path: 'statistic/', version: process.env.API_VERSION })
export class StatisticController {
	constructor(private statisticService: StatisticService) {}

	@Post('update')
	@HttpCode(200)
	async updateStatistic(@Body() dto: StatisticDto) {
		const { user, project, page, statistic } =
			await this.statisticService.getStatistic(dto)

		if (!statistic) {
			const newStatistic = await this.statisticService.create({
				userId: user.id,
				projectId: project.id,
				pageId: page.id,
				targetLanguage: dto.targetLanguage,
			})

			return newStatistic
		}

		const updatedViews = statistic.views + 1

		return await this.statisticService.updateViews(statistic.id, updatedViews)
	}

	@Get('views')
	@Auth()
	@HttpCode(200)
	async getViewsStatistic(
		@CurrentUser('id') userId: string,
		@Query('projectId') projectId: string,
		@Query('language') language: string,
		@Query('period') period: 'last7Days' | 'month' | 'lastMonth',
	) {
		return await this.statisticService.getViewsStatistic(
			userId,
			projectId,
			language,
			period,
		)
	}

	@Get('views/total')
	@Auth()
	@HttpCode(200)
	async getDashboardChartData(@CurrentUser('id') userId: string) {
		return await this.statisticService.getDashboardChartData(userId)
	}

	@Get('views/project/:projectId')
	@Auth()
	@HttpCode(200)
	async getProjectChartData(@CurrentUser('id') userId: string, @Param('projectId') projectId: string) {
		return await this.statisticService.getProjectChartData(userId, projectId)
	}
}
