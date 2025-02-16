import { IsArray, IsOptional, IsString } from 'class-validator'

export class TranslationApiDto {
	@IsString()
	projectKey: string

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	segments?: string[]

	@IsString()
	@IsOptional()
	referrer?: string

	@IsString()
	@IsOptional()
	targetLanguageCode: string

	@IsString()
	@IsOptional()
	sourceLanguageCode: string
}
