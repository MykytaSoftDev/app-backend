import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { ProjectService } from '../project/project.service'
import { SettingsModule } from '../settings/settings.module'

@Module({
	imports: [SettingsModule],
	controllers: [UserController],
	providers: [UserService, PrismaService, ProjectService],
	exports: [UserService],
})
export class UserModule {}
