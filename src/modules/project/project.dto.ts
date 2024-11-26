import { Platform } from '@prisma/client'
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator'

export class ProjectDto {
	@IsString()
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
}
