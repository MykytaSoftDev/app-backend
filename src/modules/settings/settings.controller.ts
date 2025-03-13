import { Controller } from '@nestjs/common'

@Controller({
	path: 'project/:projectId/settings',
	version: process.env.API_VERSION,
})
export class SettingsController {}
