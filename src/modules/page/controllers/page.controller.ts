import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	UsePipes,
	ValidationPipe
} from "@nestjs/common";
import { Auth } from 'src/modules/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/modules/auth/decorators/user.decorator'
import { PageService } from '../page.service'

@Controller({
	path: 'project/:projectId/pages',
	version: process.env.API_VERSION,
})
export class PageController {
	constructor(private readonly pageService: PageService) {}

	@Get()
	@Auth()
	@HttpCode(200)
	async getAll(
		@CurrentUser('id') userId: string,
		@Param('projectId') projectId: string,
	) {
		return this.pageService.getAll(userId, projectId)
	}

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

	@Delete()
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async deleteMultiple(
		@CurrentUser('id') userId: string,
		@Param('projectId') projectId: string,
		@Body() body: { ids: string[] },
	) {
		return this.pageService.deleteMultiple(userId, projectId, body.ids)
	}
}
