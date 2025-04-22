import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ExclusionController } from "./exclusion.controller";
import { ExclusionService } from "./exclusion.service";


@Module({
  controllers: [ExclusionController],
  providers: [ExclusionService, PrismaService],
  exports: [ExclusionService],
})
export class ExclusionModule {}
