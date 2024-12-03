import { TranslationServiceClient } from '@google-cloud/translate'

export class GoogleService {
	projectId: string
	location: string
	translationClient: TranslationServiceClient
	configs: { projectId: string; keyFilePath: string }

	constructor() {
		this.projectId = process.env.GOOGLE_PROJECT_ID
		this.configs = {
			projectId: this.projectId,
			keyFilePath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
		}
		this.location = process.env.GOOGLE_LOCATION
		this.translationClient = new TranslationServiceClient(this.configs)
	}

	async translate(
		segment: string,
		sourceLanguage: string,
		targetLanguage: string,
	) {
		const request = {
			parent: `projects/${this.projectId}/locations/${this.location}`,
			contents: [segment],
			mimeType: 'text/html',

			sourceLanguageCode: sourceLanguage,
			targetLanguageCode: targetLanguage,
		}

		const [response] = await this.translationClient.translateText(request)

		return response.translations[0].translatedText
	}
}