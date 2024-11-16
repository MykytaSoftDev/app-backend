import { StyleRadius, UrlStructure } from '@prisma/client'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

export class SettingsDto {
	@IsOptional()
	@IsBoolean()
	flags?: boolean

	@IsOptional()
	@IsBoolean()
	title?: boolean

	@IsOptional()
	@IsEnum(StyleRadius)
	flagType?: StyleRadius

	@IsOptional()
	@IsEnum(StyleRadius)
	widgetCorners?: StyleRadius

	@IsOptional()
	@IsString()
	widgetStyle?: string

	@IsOptional()
	@IsEnum(UrlStructure)
	UrlStructure?: UrlStructure
}
