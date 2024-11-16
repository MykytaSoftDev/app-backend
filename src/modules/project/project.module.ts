import { Module } from '@nestjs/common'
import { SettingsService } from 'src/modules/settings/settings.service'
import { PrismaService } from 'src/prisma.service'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

@Module({
	controllers: [ProjectController],
	providers: [ProjectService, PrismaService, SettingsService],
	exports: [ProjectService],
})
export class ProjectModule {}
