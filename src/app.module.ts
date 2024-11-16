import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PageModule } from './page/page.module'
import { ProjectModule } from './project/project.module'
import { TranslationModule } from './translation/translation.module'
import { UserModule } from './user/user.module'
import { WidgetModule } from './widget/widget.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		UserModule,
		ProjectModule,
		PageModule,
		TranslationModule,
		WidgetModule,
	],
})
export class AppModule {}
