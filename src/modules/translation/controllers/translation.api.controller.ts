import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common'
import { TranslationDto } from '../translation.dto'
import { TranslationService } from '../translation.service'

@Controller('user/:userId/project/:projectId/pages/:pageId/translations')
export class TranslationApiController {
	constructor(private translationService: TranslationService) {}

	async create(
		@Body() dto: TranslationDto,
		@Param('userId') userId: string,
		@Param('projectId') projectId: string,
		@Param('pageId') pageId: string,
	) {
		return this.translationService.create(dto, userId, projectId, pageId)
	}

	@Post()
	@HttpCode(200)
	async translate(
		@Body() dto: TranslationDto,
		@Param('userId') userId: string,
		@Param('projectId') projectId: string,
		@Param('pageId') pageId: string,
	) {
		return await this.translationService.translate(
			dto,
			userId,
			projectId,
			pageId,
		)
	}
}
