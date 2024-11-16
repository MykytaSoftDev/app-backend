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
import { ProjectDto } from './project.dto'
import { ProjectService } from './project.service'

@Controller('user/projects')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: ProjectDto, @CurrentUser('id') userId: string) {
		return this.projectService.create(dto, userId)
	}

	@Put(':id')
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async update(
		@Body() dto: ProjectDto,
		@CurrentUser('id') userId: string,
		@Param('id') projectId: string,
	) {
		return this.projectService.update(dto, projectId, userId)
	}

	@Delete(':id')
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async delete(
		@CurrentUser('id') userId: string,
		@Param('id') projectId: string,
	) {
		return this.projectService.delete(projectId, userId)
	}

	@Get()
	@Auth()
	@HttpCode(200)
	async getAll(@CurrentUser('id') userId: string) {
		return this.projectService.getAll(userId)
	}

	@Get(':id')
	@Auth()
	@HttpCode(200)
	async getProjectById(@Param('id') projectId: string) {
		return this.projectService.getProjectById(projectId)
	}
}
