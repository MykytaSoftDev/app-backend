import { IsArray, IsOptional, IsString } from 'class-validator'

export class TranslationDto {
	@IsString()
	@IsOptional()
	sourceText: string

	@IsString()
	@IsOptional()
	targetLanguage: string

	@IsString()
	@IsOptional()
	sourceLanguage: string

	@IsString()
	@IsOptional()
	sourceHash: string

	@IsString()
	@IsOptional()
	translatedText: string

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	segments?: string[]
}
