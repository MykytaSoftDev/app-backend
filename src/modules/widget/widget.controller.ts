import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { WidgetService } from './widget.service'

@Controller('widget')
export class WidgetController {
	constructor(private widgetService: WidgetService) {}

	@Get()
	@HttpCode(200)
	async getWidgetConfigs(
		@Query('projectKey') projectKey: string,
		@Query('domain') domain: string,
	) {
		
		return await this.widgetService.getWidgetConfigs(projectKey, domain)
	}
}
