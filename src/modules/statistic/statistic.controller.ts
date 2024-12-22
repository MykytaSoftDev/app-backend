import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { StatisticService } from './statistic.service'
import { StatisticDto } from './dto/statistic.dto'

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
}
