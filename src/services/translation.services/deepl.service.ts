import { Injectable } from '@nestjs/common'
import {
	SourceLanguageCode,
	TargetLanguageCode,
	TagHandlingMode,
	Translator, TextResult
} from "deepl-node";

@Injectable()
export class DeeplService {
	translator: Translator

	constructor() {
		this.translator = new Translator(process.env.DEEPL_API_KEY)
	}

	async translate(
		segments: string[],
		sourceLanguage: string,
		targetLanguage: string,
	): Promise<TextResult[]> {
		const options = {
			tagHandling: 'html' as TagHandlingMode,
		}

		const result = await this.translator.translateText(
			segments,
			sourceLanguage as SourceLanguageCode,
			targetLanguage as TargetLanguageCode,
			options,
		)

		return result
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
