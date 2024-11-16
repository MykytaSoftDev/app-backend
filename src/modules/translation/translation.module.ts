import { Module } from '@nestjs/common'
import { PageService } from 'src/modules/page/page.service'
import { PrismaService } from 'src/prisma.service'
import { DeeplService } from 'src/services/translation.services/deepl.service'
import { TranslationApiController } from './controllers/translation.api.controller'
import { TranslationController } from './controllers/translation.controller'
import { TranslationService } from './translation.service'

@Module({
	controllers: [TranslationController, TranslationApiController],
	providers: [TranslationService, PrismaService, DeeplService, PageService],
	exports: [TranslationService],
})
export class TranslationModule {}
