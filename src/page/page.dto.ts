import { IsNumber, IsOptional, IsString } from 'class-validator'

export class PageDto {
	@IsString()
	@IsOptional()
	pageUrl: string

	@IsString()
	@IsOptional()
	targetLanguage: string

	@IsNumber()
	@IsOptional()
	wordsCount?: number
}
