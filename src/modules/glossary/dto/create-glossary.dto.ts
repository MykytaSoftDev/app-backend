import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum GlossaryBehavior {
  TRANSLATE = 'translate',
  KEEP_ORIGINAL = 'keep_original',
}

export class CreateGlossaryDto {
  @IsString()
  @IsNotEmpty()
  sourceText: string;

  @IsString()
  @IsOptional()
  targetText?: string;

  @IsString()
  @IsNotEmpty()
  sourceLanguage: string;

  @IsArray()
  @IsNotEmpty()
  targetLanguage: string[];

  @IsEnum(GlossaryBehavior)
  behavior: GlossaryBehavior;
}
