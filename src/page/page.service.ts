import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PageDto } from './page.dto'

@Injectable()
export class PageService {
	constructor(private prisma: PrismaService) {}

	async create(dto: PageDto, userId: string, domainId: string) {
		return this.prisma.page.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
				domain: {
					connect: {
						id: domainId,
					},
				},
			},
		})
	}

	async update(
		dto: Partial<PageDto>,
		pageId: string,
		userId: string,
		domainId: string,
	) {
		return this.prisma.page.update({
			where: {
				id: pageId,
				userId: userId,
				domainId: domainId,
			},
			data: dto,
		})
	}

	async delete(pageId: string, userId: string, domainId: string) {
		return this.prisma.page.delete({
			where: {
				id: pageId,
				userId: userId,
				domainId: domainId,
			},
		})
	}

	async getAll(userId: string, domainId: string) {
		return this.prisma.page.findMany({
			where: {
				userId: userId,
				domainId: domainId,
			},
		})
	}

	async getAllWithLanguage(
		userId: string,
		domainId: string,
		targetLanguage: string,
	) {
		return this.prisma.page.findMany({
			where: {
				userId: userId,
				domainId: domainId,
				targetLanguage: targetLanguage,
			},
		})
	}

	async getPageById(pageId: string, domainId: string, userId: string) {
		return this.prisma.page.findFirstOrThrow({
			where: {
				id: pageId,
				domainId: domainId,
				userId: userId,
			},
		})
	}

	async isExcluded(userId: string, domainId: string, pageUrl: string) {
		return this.prisma.page.findFirst({
			select: {
				isExcluded: true,
			},
			where: {
				userId: userId,
				domainId: domainId,
				pageUrl: pageUrl,
			},
		})
	}
}
