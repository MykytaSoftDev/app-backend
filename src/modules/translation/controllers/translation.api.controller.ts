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

@Controller('project/translate')
export class TranslationApiController {
	constructor(private translationService: TranslationService) {}

	@Post()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async translate(@Body() dto: TranslationApiDto) {
		return await this.translationService.translate(dto)
	}
}
