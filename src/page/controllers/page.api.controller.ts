import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { PageDto } from '../page.dto'
import { PageService } from '../page.service'

@Controller('user/:userId/project/:projectId/pages')
export class PageApiController {
	constructor(private readonly pageService: PageService) {}

	@Post()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async create(
		@Body() dto: PageDto,
		@Param('userId') userId: string,
		@Param('projectId') projectId: string,
	) {
		return this.pageService.create(dto, userId, projectId)
	}

	@Put(':id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async update(
		@Body() dto: PageDto,
		@Param('id') pageId: string,
		@Param('userId') userId: string,
		@Param('projectId') projectId: string,
	) {
		return this.pageService.update(dto, pageId, userId, projectId)
	}

	@Delete(':id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async delete(
		@Param('id') pageId: string,
		@Param('userId') userId: string,
		@Param('projectId') projectId: string,
	) {
		return this.pageService.delete(pageId, userId, projectId)
	}

	@Get()
	@HttpCode(200)
	async getAll(
		@Param('userId') userId: string,
		@Param('projectId') projectId: string,
	) {
		return this.pageService.getAll(userId, projectId)
	}

	@Get(':id')
	@HttpCode(200)
	async getPageById(
		@Param('id') pageId: string,
		@Param('userId') userId: string,
		@Param('projectId') projectId: string,
	) {
		return this.pageService.getPageById(pageId, projectId, userId)
	}
}
