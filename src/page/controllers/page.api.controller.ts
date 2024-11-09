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

@Controller('user/:userId/domains/:domainId/pages')
export class PageApiController {
	constructor(private readonly pageService: PageService) {}

	@Post()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async create(
		@Body() dto: PageDto,
		@Param('userId') userId: string,
		@Param('domainId') domainId: string,
	) {
		return this.pageService.create(dto, userId, domainId)
	}

	@Put(':id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async update(
		@Body() dto: PageDto,
		@Param('id') pageId: string,
		@Param('userId') userId: string,
		@Param('domainId') domainId: string,
	) {
		return this.pageService.update(dto, pageId, userId, domainId)
	}

	@Delete(':id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async delete(
		@Param('id') pageId: string,
		@Param('userId') userId: string,
		@Param('domainId') domainId: string,
	) {
		return this.pageService.delete(pageId, userId, domainId)
	}

	@Get()
	@HttpCode(200)
	async getAll(
		@Param('userId') userId: string,
		@Param('domainId') domainId: string,
	) {
		return this.pageService.getAll(userId, domainId)
	}

	@Get(':id')
	@HttpCode(200)
	async getDomainById(
		@Param('id') pageId: string,
		@Param('userId') userId: string,
		@Param('domainId') domainId: string,
	) {
		return this.pageService.getPageById(pageId, domainId, userId)
	}
}
