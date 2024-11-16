import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PageDto } from './page.dto'

@Injectable()
export class PageService {
	constructor(private prisma: PrismaService) {}

	async create(dto: PageDto, userId: string, projectId: string) {
		return this.prisma.page.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
				project: {
					connect: {
						id: projectId,
					},
				},
			},
		})
	}

	async update(
		dto: Partial<PageDto>,
		pageId: string,
		userId: string,
		projectId: string,
	) {
		return this.prisma.page.update({
			where: {
				id: pageId,
				userId: userId,
				projectId: projectId,
			},
			data: dto,
		})
	}

	async delete(pageId: string, userId: string, projectId: string) {
		return this.prisma.page.delete({
			where: {
				id: pageId,
				userId: userId,
				projectId: projectId,
			},
		})
	}

	async getAll(userId: string, projectId: string) {
		return this.prisma.page.findMany({
			where: {
				userId: userId,
				projectId: projectId,
			},
		})
	}

	async getAllWithLanguage(
		userId: string,
		projectId: string,
		targetLanguage: string,
	) {
		return this.prisma.page.findMany({
			where: {
				userId: userId,
				projectId: projectId,
				targetLanguage: targetLanguage,
			},
		})
	}

	async getPageById(pageId: string, projectId: string, userId: string) {
		return this.prisma.page.findFirstOrThrow({
			where: {
				id: pageId,
				projectId: projectId,
				userId: userId,
			},
		})
	}

	async isExcluded(userId: string, projectId: string, pageUrl: string) {
		return this.prisma.page.findFirst({
			select: {
				isExcluded: true,
			},
			where: {
				userId: userId,
				projectId: projectId,
				pageUrl: pageUrl,
			},
		})
	}
}
