import { IsEnum, IsOptional, IsString } from "class-validator";
import { PatternMatchType } from "@prisma/client";

export class PageExclusionDto {
  @IsString()
  @IsOptional()
  pattern: string

  @IsOptional()
  @IsEnum(PatternMatchType)
  rule: PatternMatchType
}

export class SelectorExclusionDto {
  @IsString()
  @IsOptional()
  selector: string

  @IsString()
  @IsOptional()
  description: string
}