import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { TranslationApiDto } from '../dto/translation.api.dto'
import { TranslationService } from '../translation.service'

@Controller({ path: 'project/translate', version: process.env.API_VERSION })
export class TranslationApiController {
	constructor(private translationService: TranslationService) {}

	@Post()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async translate(@Body() dto: TranslationApiDto) {
		return await this.translationService.translate(dto)
	}
}
