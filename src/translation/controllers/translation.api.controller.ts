import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common'
import { TranslationDto } from '../translation.dto'
import { TranslationService } from '../translation.service'

@Controller('user/:userId/domains/:domainId/pages/:pageId/translations')
export class TranslationApiController {
	constructor(private translationService: TranslationService) {}

	async create(
		@Body() dto: TranslationDto,
		@Param('userId') userId: string,
		@Param('domainId') domainId: string,
		@Param('pageId') pageId: string,
	) {
		return this.translationService.create(dto, userId, domainId, pageId)
	}

	@Post()
	@HttpCode(200)
	async translate(
		@Body() dto: TranslationDto,
		@Param('userId') userId: string,
		@Param('domainId') domainId: string,
		@Param('pageId') pageId: string,
	) {
		return await this.translationService.translate(dto, userId, domainId, pageId)
	}
}
