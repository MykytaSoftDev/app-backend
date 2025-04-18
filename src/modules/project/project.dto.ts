import { Platform } from '@prisma/client'
import {
	ArrayNotEmpty,
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator'

export class ProjectDto {
	@IsString()
	@IsOptional()
	domainName: string

	@IsEnum(Platform)
	@IsOptional()
	platform: Platform

	@IsString()
	@IsOptional()
	sourceLanguage: string

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	@IsOptional()
	targetLanguages: string[]

	@IsNumber()
	@IsOptional()
	wordsCount: number

	@IsBoolean()
	@IsOptional()
	isPublished: boolean

	@IsBoolean()
	@IsOptional()
	isActivated: boolean

	@IsBoolean()
	@IsOptional()
	newTranslationEnabled?: boolean
}
