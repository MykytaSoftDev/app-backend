import {
	Body,
	Controller,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { TranslationApiDto } from '../dto/translation.api.dto'
import { TranslationService } from '../translation.service'

@Controller('project/:projectId/translate')
export class TranslationApiController {
	constructor(private translationService: TranslationService) {}

	@Post()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async translate(
		@Body() dto: TranslationApiDto,
		@Param('projectId') projectId: string,
	) {
		return await this.translationService.translate(dto, projectId)
	}
}
