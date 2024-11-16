import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/modules/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/modules/auth/decorators/user.decorator'
import { PageService } from '../page.service'

@Controller('user/project/:projectId/pages')
export class PageController {
	constructor(private readonly pageService: PageService) {}

	@Delete(':id')
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async delete(
		@Param('id') pageId: string,
		@CurrentUser('id') userId: string,
		@Param('projectId') projectId: string,
	) {
		return this.pageService.delete(pageId, userId, projectId)
	}

	@Get()
	@Auth()
	@HttpCode(200)
	async getAll(
		@CurrentUser('id') userId: string,
		@Param('projectId') projectId: string,
	) {
		return this.pageService.getAll(userId, projectId)
	}
}
