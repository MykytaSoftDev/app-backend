import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectDto } from './project.dto'

@Injectable()
export class ProjectService {
	constructor(private prisma: PrismaService) {}

	async create(dto: ProjectDto, userId: string) {
		return this.prisma.project.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})
	}

	async update(dto: Partial<ProjectDto>, projectId: string, userId: string) {
		return this.prisma.project.update({
			where: {
				userId: userId,
				id: projectId,
			},
			data: dto,
		})
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
		return this.prisma.project.findMany({
			where: {
				userId: userId,
			},
		})
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
}
