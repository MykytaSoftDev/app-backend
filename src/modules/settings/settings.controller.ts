import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { Auth } from "../auth/decorators/auth.decorator";
import { SettingsService } from "./settings.service";

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
}
