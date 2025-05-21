import { Body, Controller, Get, HttpCode, Param, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { Auth } from "../auth/decorators/auth.decorator";
import { SettingsService } from "./settings.service";
import { SettingsDto } from "./settings.dto";

@Controller({
	path: 'project/:projectId/settings',
	version: process.env.API_VERSION,
})
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Get()
	@Auth()
	@HttpCode(200)
	async get(@Param('projectId') projectId: string) {
		return await this.settingsService.getProjectSettings(projectId);
	}

	@Put(':id')
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Param('projectId') projectId: string,
		@Body() settings: SettingsDto) {
		console.log('id',id);
		console.log('projectId', projectId);
		console.log(settings);
		return await this.settingsService.update(id, projectId, settings);
	}
}
