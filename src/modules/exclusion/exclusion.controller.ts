import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ExclusionService } from "./exclusion.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { PageDto } from "../page/page.dto";
import { PageExclusionDto, SelectorExclusionDto } from "./exclusion.dto";

@Controller({
  path: 'project/:projectId/exclusions',
  version: process.env.API_VERSION,
})
export class ExclusionController {

  constructor(private exclusionService: ExclusionService) {}

  @Get()
  @Auth()
  @HttpCode(200)
  async get(@Param('projectId') projectId: string) {
    return await this.exclusionService.get(projectId);
  }

  @Post('pages')
  @Auth()
  @HttpCode(201)
  async createPageExclusion(@Param('projectId') projectId: string, @Body() dto: PageExclusionDto) {
    return await this.exclusionService.createPageExclusion(projectId, dto)
  }

  @Post('blocks')
  @Auth()
  @HttpCode(201)
  async createSelectorExclusion(@Param('projectId') projectId: string, @Body() dto: SelectorExclusionDto) {
    return await this.exclusionService.createBlockExclusion(projectId, dto)
  }

}