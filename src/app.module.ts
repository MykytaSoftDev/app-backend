import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { PageModule } from './modules/page/page.module'
import { ProjectModule } from './modules/project/project.module'
import { SettingsModule } from './modules/settings/settings.module'
import { TranslationModule } from './modules/translation/translation.module'
import { UserModule } from './modules/user/user.module'
import { WidgetModule } from './modules/widget/widget.module'
import { StatisticModule } from './modules/statistic/statistic.module'
import { ExclusionModule } from "./modules/exclusion/exclusion.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		UserModule,
		ProjectModule,
		PageModule,
		TranslationModule,
		WidgetModule,
		SettingsModule,
		StatisticModule,
		ExclusionModule,
	],
})
export class AppModule {}
