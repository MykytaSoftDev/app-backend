import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { DomainController } from './domain.controller'
import { DomainService } from './domain.service'

@Module({
	controllers: [DomainController],
	providers: [DomainService, PrismaService],
	exports: [DomainService],
})
export class DomainModule {}