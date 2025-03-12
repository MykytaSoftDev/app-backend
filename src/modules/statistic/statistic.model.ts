import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { StatisticController } from './statistic.controller'
import { StatisticService } from './statistic.service'
import { ProjectService } from '../project/project.service'
import { SettingsModule } from '../settings/settings.module'
import { PageService } from '../page/page.service'
import { LanguageService } from 'src/services/language.service'
import { UserService } from '../user/user.service'

@Module({
	imports: [SettingsModule],
	controllers: [StatisticController],
	providers: [StatisticService, PrismaService, ProjectService, PageService, LanguageService, UserService],
	exports: [StatisticService],
})
export class StatisticModule {}
