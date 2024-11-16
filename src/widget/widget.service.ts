import { Injectable } from '@nestjs/common'
import { DomainService } from 'src/domain/domain.service'
import { PageService } from 'src/page/page.service'
import { LanguageService } from 'src/services/language.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class WidgetService {
	constructor(
		private languageService: LanguageService,
		private userService: UserService,
		private domainService: DomainService,
		private pageService: PageService,
	) {}

	async getWidgetConfigs(apiKey: string, referrer: string) {
		if (!apiKey) return { error: 'Api Key is Required' }

		const userId = (await this.userService.getUserByApiKey(apiKey)).id
		const { hostname: domainName, pathname: pagePath } = new URL(
			await this.decodeFromBase64(referrer),
		)
		const { id, ...domain } = await this.domainService.getDomainByDomainName(
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
				domain.targetLanguages,
			)
		const sourceLanguage = await this.languageService.getObjectByCode2(
			domain.sourceLanguage,
		)

		return {
			sourceLanguage: sourceLanguage,
			sourceLanguageCode: domain.sourceLanguage,
			targetLanguagesCodes: domain.targetLanguages,
			targetLanguages: targetLanguagesDetails,
			isPublished: domain.isPublished,
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
