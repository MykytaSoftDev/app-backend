import { IsString } from 'class-validator'

export class StatisticDto {
	@IsString()
	projectKey: string

	@IsString()
	referrer: string

	@IsString()
	projectId: string

	@IsString()
	targetLanguage: string
}

export class CreateStatisticDto {
	@IsString()
	userId?: string

	@IsString()
	projectId?: string

	@IsString()
	pageId?: string

	@IsString()
	targetLanguage: string
}
