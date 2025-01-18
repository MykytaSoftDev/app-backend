import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class PlanService {
	constructor(private prisma: PrismaService) {}

	async getPlans() {
		return await this.prisma.plan.findMany()
	}

	async getPlan(planId: number) {
		return await this.prisma.plan.findFirst({
			where: {
				id: planId,
			},
		})
	}

	async getUsersLimits(userId: string, planId: number) {
		const plan = await this.getPlan(planId)
	}
}
