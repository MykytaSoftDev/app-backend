import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common'
import { StatisticService } from './statistic.service'
import { StatisticDto } from './dto/statistic.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('user/statistic/')
export class StatisticController {
	constructor(private statisticService: StatisticService) {}

	@Post()
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
}
