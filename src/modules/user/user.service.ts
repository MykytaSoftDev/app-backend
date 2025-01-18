import { Injectable } from '@nestjs/common'
import { hash, limits } from 'argon2'
import { randomBytes } from 'crypto'
import { AuthDto } from 'src/modules/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './user.dto'
import { ProjectService } from '../project/project.service'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private projectService: ProjectService,
	) {}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: dto.name,
			password: await hash(dto.password),
			apiKey: await this.generateApiKey(),
		}

		return this.prisma.user.create({
			data: user,
		})
	}

	async update(id: string, dto: UserDto) {
		let data = dto

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		}

		return this.prisma.user.update({
			where: {
				id,
			},
			data,
		})
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
		})
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email,
			},
		})
	}

	async getUserByApiKey(apiKey: string) {
		return this.prisma.user.findFirst({
			where: {
				apiKey: apiKey,
			},
		})
	}

	async getCurrentPlan(id: number) {
		return this.prisma.plan.findFirst({
			where: {
				id,
			},
		})
	}

	async getProfileData(id: string) {
		const { password, ...user } = await this.getById(id)

		const projects = await this.projectService.getAll(id)

		const plan = await this.getCurrentPlan(user.planId)

		const totalWords = projects.reduce(
			(sum, project) => sum + project.wordsCount,
			0,
		)

		const totalTargetLanguages = projects.reduce((set, project) => {
			project.targetLanguages.forEach(lang => set.add(lang))
			return set
		}, new Set()).size

		const percentageUsage = {
			words: {
				percents: Math.min(
					100,
					Math.round((totalWords / plan.wordsLimit) * 100),
				),
				count: totalWords,
				isExceed: plan.wordsLimit < totalWords,
			},
			projects: {
				percents: Math.min(
					100,
					Math.round((projects.length / plan.projectsLimit) * 100),
				),
				count: projects.length,
				isExceed: plan.projectsLimit < projects.length,
			},
			languages: {
				percents: Math.min(
					100,
					Math.round((totalTargetLanguages / plan.languagesLimit) * 100),
				),
				count: totalTargetLanguages,
				isExceed: plan.languagesLimit < totalTargetLanguages,
			},
		}

		return {
			user: user,
			projects: projects,
			plan: plan,
			usage: percentageUsage,
		}
	}

	private async generateApiKey() {
		const prefix = process.env.KEY_PREFIX
		const apiKey = `${prefix}_${randomBytes(16).toString('hex')}`
		return apiKey
	}
}
