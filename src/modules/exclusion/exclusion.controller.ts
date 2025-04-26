import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ExclusionService } from "./exclusion.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { PageExclusionDto, SelectorExclusionDto } from "./exclusion.dto";
import { CurrentUser } from "../auth/decorators/user.decorator";

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
  async createPageExclusion(@CurrentUser('id') userId: string,@Param('projectId') projectId: string, @Body() dto: PageExclusionDto) {
    return await this.exclusionService.createPageExclusion(userId, projectId, dto)
  }

  @Post('blocks')
  @Auth()
  @HttpCode(201)
  async createSelectorExclusion(@Param('projectId') projectId: string, @Body() dto: SelectorExclusionDto) {
    return await this.exclusionService.createBlockExclusion(projectId, dto)
  }

  @Delete('pages/:id')
  @Auth()
  @HttpCode(204)
  async deletePageExclusion(
    @CurrentUser('id') userId: string,
    @Param('id') exclusionId: string,
    @Param('projectId') projectId: string,
  ) {
    return await this.exclusionService.deletePageExclusion(userId, exclusionId, projectId)
  }

  @Delete('pages')
  @Auth()
  @HttpCode(204)
  async deleteMultiplePageExclusions(
    @CurrentUser('id') userId: string,
    @Param('projectId') projectId: string,
    @Body() body: { ids: string[] },
  ) {
    return await this.exclusionService.deleteMultiplePageExclusions(userId, projectId, body.ids)
  }

  @Delete('blocks/:id')
  @Auth()
  @HttpCode(204)
  async deleteBlockExclusion(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    return await this.exclusionService.deleteBlockExclusion(id, projectId)
  }

  @Delete('blocks')
  @Auth()
  @HttpCode(204)
  async deleteMultipleBlockExclusions(
    @Param('projectId') projectId: string,
    @Body() body: { ids: string[] },
  ) {
    return await this.exclusionService.deleteMultipleBlockExclusions(projectId, body.ids)
  }
}