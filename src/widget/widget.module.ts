import { Module } from '@nestjs/common'
import { PageService } from 'src/page/page.service'
import { PrismaService } from 'src/prisma.service'
import { ProjectService } from 'src/project/project.service'
import { LanguageService } from 'src/services/language.service'
import { UserService } from 'src/user/user.service'
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
	],
	exports: [WidgetService],
})
export class WidgetModule {}
