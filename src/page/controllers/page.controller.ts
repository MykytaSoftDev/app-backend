import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { PageService } from '../page.service'

@Controller('user/domains/:domainId/pages')
export class PageController {
	constructor(private readonly pageService: PageService) {}

	@Delete(':id')
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async delete(
		@Param('id') pageId: string,
		@CurrentUser('id') userId: string,
		@Param('domainId') domainId: string,
	) {
		return this.pageService.delete(pageId, userId, domainId)
	}

	@Get()
	@Auth()
	@HttpCode(200)
	async getAll(
		@CurrentUser('id') userId: string,
		@Param('domainId') domainId: string,
	) {
		return this.pageService.getAll(userId, domainId)
	}
}
