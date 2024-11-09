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
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { DomainDto } from './domain.dto'
import { DomainService } from './domain.service'

@Controller('user/domains')
export class DomainController {
	constructor(private readonly domainService: DomainService) {}

	@Post()
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: DomainDto, @CurrentUser('id') userId: string) {
		return this.domainService.create(dto, userId)
	}

	@Put(':id')
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async update(
		@Body() dto: DomainDto,
		@CurrentUser('id') userId: string,
		@Param('id') domainId: string,
	) {
		return this.domainService.update(dto, domainId, userId)
	}

	@Delete(':id')
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async delete(
		@CurrentUser('id') userId: string,
		@Param('id') domainId: string,
	) {
		return this.domainService.delete(domainId, userId)
	}

	@Get()
	@Auth()
	@HttpCode(200)
	async getAll(@CurrentUser('id') userId: string) {
		return this.domainService.getAll(userId)
	}

	@Get(':id')
	@Auth()
	@HttpCode(200)
	async getDomainById(@Param('id') domainId: string) {
		return this.domainService.getDomainById(domainId)
	}
}
