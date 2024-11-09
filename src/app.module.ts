import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { DomainModule } from './domain/domain.module'
import { PageModule } from './page/page.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		UserModule,
		DomainModule,
		PageModule,
	],
})
export class AppModule {}
