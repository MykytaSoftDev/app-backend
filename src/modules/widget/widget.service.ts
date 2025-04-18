import { Injectable } from '@nestjs/common'
import { PageService } from 'src/modules/page/page.service'
import { ProjectService } from 'src/modules/project/project.service'
import { SettingsService } from 'src/modules/settings/settings.service'
import { UserService } from 'src/modules/user/user.service'
import { LanguageService } from 'src/services/language.service'

@Injectable()
export class WidgetService {
	constructor(
		private languageService: LanguageService,
		private userService: UserService,
		private projectService: ProjectService,
		private pageService: PageService,
		private settingsService: SettingsService,
	) {}

	async getWidgetConfigs(projectKey: string, domain: string) {
		if (!projectKey) return { error: 'Api Key is Required' }

		// const domainName = await this.decodeFromBase64(domain)
		const domainName = atob(domain)
		const project = await this.projectService.getProjectByProjectKey(projectKey)
		console.log(project)

		if (!project) return { error: 'Project does not exist' }
		console.log(domainName)
		console.log(project.domainName)
		if (domainName !== project.domainName)
			return { error: 'This project is not related to this domain' }
		// const { isExcluded } = await this.pageService.isExcluded(
		// 	userId,
		// 	project.id,
		// 	pagePath,
		// )

		const targetLanguagesDetails =
			await this.languageService.getTargetLanguagesDetails(
				project.targetLanguages,
			)
		const sourceLanguage = await this.languageService.getObjectByCode2(
			project.sourceLanguage,
		)
		const projectSettings = await this.settingsService.getProjectSettings(
			project.id,
		)

		return {
			sourceLanguage: sourceLanguage,
			targetLanguages: targetLanguagesDetails,
			isPublished: project.isPublished,
			settings: projectSettings,
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
