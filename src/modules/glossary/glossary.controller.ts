import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { GlossaryService } from './glossary.service';
import { CreateGlossaryDto } from "./dto/create-glossary.dto";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { Auth } from "../auth/decorators/auth.decorator";
import { UpdateGlossaryDto } from "./dto/update-glossary.dto";

@Controller({
  path: 'project/:projectId/glossary',
  version: process.env.API_VERSION,
})
export class GlossaryController {
  constructor(private readonly glossaryService: GlossaryService) {}

  @Post()
  @Auth()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async create(
    @CurrentUser('id') userId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateGlossaryDto
  ) {
    return await this.glossaryService.create(userId, projectId, dto)
  }

  @Get()
  @Auth()
  @HttpCode(200)
  async get(
    @CurrentUser() userId: string,
    @Param('projectId') projectId: string,
  ) {
    return await this.glossaryService.get(userId, projectId)
  }

  @Put(':glossaryId')
  @Auth()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async update(
    @CurrentUser('id') userId: string,
    @Param('projectId') projectId: string,
    @Param('glossaryId') glossaryId: string,
    @Body() dto: UpdateGlossaryDto
  ) {
    return await this.glossaryService.update(glossaryId, userId, projectId, dto)
  }

  @Delete(':glossaryId')
  @Auth()
  @HttpCode(204)
  async delete(
    @CurrentUser() userId: string,
    @Param('projectId') projectId: string,
    @Param('glossaryId') glossaryId: string,
  ) {
    return await this.glossaryService.delete(userId, projectId, glossaryId)
  }

  @Delete('')
  @Auth()
  @HttpCode(204)
  async deleteMultiple(
    @CurrentUser() userId: string,
    @Param('projectId') projectId: string,
    @Body() body: { ids: string[] },
  ) {
    return await this.glossaryService.deleteMultiple(userId, projectId, body.ids)
  }
}
