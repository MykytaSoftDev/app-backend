import { IsString, IsOptional } from 'class-validator'

export class PageDto {
	@IsString()
	@IsOptional()
	pageUrl: string

	@IsString()
	@IsOptional()
	targetLanguage: string
}
