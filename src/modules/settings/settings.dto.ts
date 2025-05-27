import {
	FlagDisplayMode, Position,
	TitleDisplayMode,
	UrlStructure,
	WidgetDisplayMode,
	WidgetStyle
} from "@prisma/client";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class SettingsDto {
	@IsOptional()
	@IsEnum(TitleDisplayMode)
	titleDisplayMode?: TitleDisplayMode

	@IsOptional()
	@IsEnum(FlagDisplayMode)
	flagDisplayMode?: FlagDisplayMode

	@IsOptional()
	@IsEnum(WidgetDisplayMode)
	widgetDisplayMode?: WidgetDisplayMode

	@IsOptional()
	@IsEnum(WidgetStyle)
	widgetStyle?: WidgetStyle

	@IsOptional()
	@IsEnum(Position)
	position?: Position

	@IsOptional()
	@IsString()
	customPosition: string

	@IsOptional()
	@IsEnum(UrlStructure)
	urlStructure?: UrlStructure

	@IsOptional()
	@IsBoolean()
	autoRedirect?: boolean

	@IsOptional()
	@IsBoolean()
	dynamicTranslation?: boolean

	@IsOptional()
	@IsBoolean()
	parseImages?: boolean

	@IsOptional()
	@IsBoolean()
	parseVideos?: boolean

	@IsOptional()
	@IsBoolean()
	parseDocs?: boolean
}
