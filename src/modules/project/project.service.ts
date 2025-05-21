import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { SettingsService } from '../settings/settings.service'
import { ProjectDto } from './project.dto'
import { randomBytes } from 'crypto'

@Injectable()
export class ProjectService {
	constructor(
		private prisma: PrismaService,
		private projectSettingsService: SettingsService,
	) {}

	async create(dto: ProjectDto, userId: string) {
		try {
			const project = await this.prisma.project.create({
				data: {
					...dto,
					projectKey: await this.generateApiKey(),
					user: {
						connect: {
							id: userId,
						},
					},
				},
			})
			const projectSettings = await this.projectSettingsService.create(project.id)
			return { project, projectSettings }
		}catch (error) {
			if (error.code === 'P2002') {
				// Prisma error when duplicating error
				throw new ConflictException('Project with this domain already exists.');
			}

			throw new InternalServerErrorException('Something went wrong while updating the project');
		}
	}

	async update(dto: Partial<ProjectDto>, projectId: string, userId: string) {
		try {
			const response = await this.prisma.project.update({
				where: {
					userId: userId,
					id: projectId,
				},
				data: dto,
			})

			return response
		}catch (error) {
			console.log(error)
			if (error.code === 'P2025') {
				// Prisma error when record is not found
				throw new NotFoundException('Project not found');
			}

			if (error.code === 'P2002') {
				// Prisma error when duplicating error
				throw new ConflictException('Project with this domain already exists');
			}

			throw new InternalServerErrorException('Something went wrong while updating the project');
		}

	}

	async delete(projectId: string, userId: string) {
		return this.prisma.project.delete({
			where: {
				userId: userId,
				id: projectId,
			},
		})
	}

	async getAll(userId: string) {
		try {
			const result =	await this.prisma.project.findMany({
				where: {
					userId: userId,
				},
			})

			return result || []
		}catch (error) {
			throw new Error(error)
		}
	}

	async getProjectById(projectId: string) {
		return this.prisma.project.findUnique({
			where: {
				id: projectId,
			},
		})
	}

	async getProjectByDomainName(userId: string, domainName: string) {
		return this.prisma.project.findFirst({
			select: {
				id: true,
				sourceLanguage: true,
				targetLanguages: true,
				isPublished: true,
			},
			where: {
				userId: userId,
				domainName: domainName,
			},
		})
	}

	async getProjectByProjectKey(projectKey: string) {
		return this.prisma.project.findFirst({
			select: {
				id: true,
				userId: true,
				sourceLanguage: true,
				targetLanguages: true,
				isPublished: true,
				isActivated: true,
				domainName: true,
			},
			where: {
				projectKey: projectKey,
			},
		})
	}

	async getActivationStatus(projectId: string) {
		return this.prisma.project.findFirst({
			where: {
				id: projectId
			},
			select: {
				isActivated: true,
			}
		})
	}

	private async generateApiKey() {
		const prefix = process.env.KEY_PREFIX
		const apiKey = `${prefix}_${randomBytes(16).toString('hex')}`
		return apiKey
	}
}
