import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ExclusionController } from "./exclusion.controller";
import { ExclusionService } from "./exclusion.service";
import { WordCounterService } from "../../services/wordcounter.service";
import { ProjectModule } from "../project/project.module";
import { PageService } from "../page/page.service";


@Module({
  controllers: [ExclusionController],
  providers: [ExclusionService, WordCounterService, PageService, PrismaService],
  exports: [ExclusionService],
  imports: [ProjectModule]
})
export class ExclusionModule {}
