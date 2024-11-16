import { Injectable } from '@nestjs/common'
import { PageService } from 'src/page/page.service'
import { ProjectService } from 'src/project/project.service'
import { LanguageService } from 'src/services/language.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class WidgetService {
	constructor(
		private languageService: LanguageService,
		private userService: UserService,
		private projectService: ProjectService,
		private pageService: PageService,
	) {}

	async getWidgetConfigs(apiKey: string, referrer: string) {
		if (!apiKey) return { error: 'Api Key is Required' }

		const userId = (await this.userService.getUserByApiKey(apiKey)).id
		const { hostname: domainName, pathname: pagePath } = new URL(
			await this.decodeFromBase64(referrer),
		)
		const { id, ...project } = await this.projectService.getProjectByDomainName(
			userId,
			domainName,
		)
		const { isExcluded } = await this.pageService.isExcluded(
			userId,
			id,
			pagePath,
		)

		const targetLanguagesDetails =
			await this.languageService.getTargetLanguagesDetails(
				project.targetLanguages,
			)
		const sourceLanguage = await this.languageService.getObjectByCode2(
			project.sourceLanguage,
		)

		// const projectSettings =

		return {
			sourceLanguage: sourceLanguage,
			sourceLanguageCode: project.sourceLanguage,
			targetLanguagesCodes: project.targetLanguages,
			targetLanguages: targetLanguagesDetails,
			isPublished: project.isPublished,
			isExcluded: isExcluded,
			settings: {},
		}
	}

	async getAllLanguages() {
		return this.languageService.getAllLanguages()
	}

	async decodeFromBase64(referrer: string) {
		const binStr = atob(referrer)
		const u8 = new Uint8Array(binStr.length)
		for (let i = 0; i < binStr.length; i++) {
			u8[i] = binStr.charCodeAt(i)
		}
		return new TextDecoder().decode(u8)
	}
}
