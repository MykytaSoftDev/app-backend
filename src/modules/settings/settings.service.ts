import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { SettingsDto } from './settings.dto'

@Injectable()
export class SettingsService {
	constructor(private prisma: PrismaService) {}

	async create(projectId: string) {
		const data = SettingsDto
		return this.prisma.projectSettings.create({
			data: {
				...data,
				project: {
					connect: { id: projectId },
				},
			},
		})
	}

	async getProjectSettings(projectId: string) {
		return this.prisma.projectSettings.findFirst({
			select: {
				id: true,
				flags: true,
				flagType: true,
				title: true,
				widgetStyle: true,
				widgetCorners: true,
				urlStructure: true,
			},
			where: {
				projectId: projectId,
			},
		})
	}
}
