import { PartialType } from '@nestjs/mapped-types';
import { CreateGlossaryDto } from './create-glossary.dto';

export class UpdateGlossaryDto extends PartialType(CreateGlossaryDto) {}
