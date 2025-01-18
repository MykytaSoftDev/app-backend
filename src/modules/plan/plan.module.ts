import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PlanService } from './plan.service'

@Module({
	controllers: [],
	providers: [PlanService, PrismaService],
	exports: [PlanService],
})
export class PlanModule {}
