import { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node'

export class DeeplService {
	translator: Translator

	constructor() {
		this.translator = new Translator(process.env.DEEPL_API_KEY)
	}

	async translate(
		segment: string,
		sourceLanguage: string,
		targetLanguage: string,
	) {
		const result = await this.translator.translateText(
			segment,
			sourceLanguage as SourceLanguageCode,
			targetLanguage as TargetLanguageCode,
		)
		console.log(result)
		return result.text
	}

	async getSourceLanguages() {
		return this.translator.getSourceLanguages()
	}

	async getTargetLanguages() {
		return this.translator.getTargetLanguages()
	}
}
