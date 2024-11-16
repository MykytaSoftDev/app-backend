import { Module } from '@nestjs/common'
import { PageService } from 'src/modules/page/page.service'
import { ProjectService } from 'src/modules/project/project.service'
import { SettingsService } from 'src/modules/settings/settings.service'
import { UserService } from 'src/modules/user/user.service'
import { PrismaService } from 'src/prisma.service'
import { LanguageService } from 'src/services/language.service'
import { WidgetController } from './widget.controller'
import { WidgetService } from './widget.service'

@Module({
	controllers: [WidgetController],
	providers: [
		WidgetService,
		PrismaService,
		LanguageService,
		UserService,
		ProjectService,
		PageService,
		SettingsService,
	],
	exports: [WidgetService],
})
export class WidgetModule {}
