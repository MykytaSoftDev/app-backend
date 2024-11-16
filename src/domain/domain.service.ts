import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { DomainDto } from './domain.dto'

@Injectable()
export class DomainService {
	constructor(private prisma: PrismaService) {}

	async create(dto: DomainDto, userId: string) {
		return this.prisma.domain.create({
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

	async update(dto: Partial<DomainDto>, domainId: string, userId: string) {
		return this.prisma.domain.update({
			where: {
				userId: userId,
				id: domainId,
			},
			data: dto,
		})
	}

	async delete(domainId: string, userId: string) {
		return this.prisma.domain.delete({
			where: {
				userId: userId,
				id: domainId,
			},
		})
	}

	async getAll(userId: string) {
		return this.prisma.domain.findMany({
			where: {
				userId: userId,
			},
		})
	}

	async getDomainById(domainId: string) {
		return this.prisma.domain.findUnique({
			where: {
				id: domainId,
			},
		})
	}

	async getDomainByDomainName(userId: string, domainName: string) {
		return this.prisma.domain.findFirst({
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
