import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class LanguageService {
	constructor(private prisma: PrismaService) {}

	async getAllLanguages() {
		return this.prisma.language.findMany({
			select: {
				id: true,
				title: true,
				titleNative: true,
				code2: true,
				isRightToLeft: true,
				flag: true,
			},
		})
	}

	async getTargetLanguagesDetails(targetLanguages: string[]) {
		return Promise.all(targetLanguages.map(code => this.getObjectByCode2(code)))
	}

	async getObjectByCode2(code2: string) {
		const languages = await this.getAllLanguages()
		const entry = languages.find(language => language.code2 === code2)

		return entry || null
	}
}
