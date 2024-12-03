import { Injectable } from '@nestjs/common'
import {
	SourceLanguageCode,
	TargetLanguageCode,
	TagHandlingMode,
	Translator,
} from 'deepl-node'

@Injectable()
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
		const options = {
			tagHandling: 'html' as TagHandlingMode,
		}

		const result = await this.translator.translateText(
			segment,
			sourceLanguage as SourceLanguageCode,
			targetLanguage as TargetLanguageCode,
			options,
		)
		return result.text
	}

	async getSourceLanguages() {
		return (await this.translator.getSourceLanguages()).map(
			language => language.code,
		)
	}

	async getTargetLanguages() {
		const targetLanguagesCodes = (
			await this.translator.getTargetLanguages()
		).map(language => language.code)

		// Remove suffixes
		const cleanedCodes = targetLanguagesCodes.map(code => code.split('-')[0])
		const uniqueCodes = [...new Set(cleanedCodes)]

		return uniqueCodes
	}
}
