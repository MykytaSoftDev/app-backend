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

	async update(id: string, projectId: string, settings: SettingsDto) {
		try {
			return this.prisma.projectSettings.update({
				data: settings,
				where: {
					id: id,
					projectId: projectId
				}
			})

		}catch (error) {
			console.error(error)
		}
	}

	async getProjectSettings(projectId: string) {
		return this.prisma.projectSettings.findFirst({
			select: {
				id: true,
				autoRedirect: true,
				dynamicTranslation: true,
				parseImages: true,
				parseVideos: true,
				parseDocs: true,
				titleDisplayMode: true,
				flagDisplayMode: true,
				widgetDisplayMode: true,
				widgetStyle: true,
				position: true,
				customPosition: true,
				urlStructure: true,
			},
			where: {
				projectId: projectId,
			},
		})
	}
}
