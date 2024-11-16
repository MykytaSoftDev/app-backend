import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PageApiController } from './controllers/page.api.controller'
import { PageController } from './controllers/page.controller'
import { PageService } from './page.service'

@Module({
	controllers: [PageController, PageApiController],
	providers: [PageService, PrismaService],
	exports: [PageService],
})
export class PageModule {}
