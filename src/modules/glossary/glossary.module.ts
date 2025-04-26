import { Module } from '@nestjs/common';
import { GlossaryService } from './glossary.service';
import { GlossaryController } from './glossary.controller';
import { PrismaService } from "../../prisma.service";

@Module({
  controllers: [GlossaryController],
  providers: [GlossaryService, PrismaService],
})
export class GlossaryModule {}
