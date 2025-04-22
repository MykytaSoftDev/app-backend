import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PageExclusionDto, SelectorExclusionDto } from "./exclusion.dto";

@Injectable()
export class ExclusionService {

  constructor(private prismaService: PrismaService) {}

  async createPageExclusion(projectId: string, dto: PageExclusionDto) {
    try {
      return await this.prismaService.pageExclusion.create({
				data: { ...dto, project: { connect: {id: projectId}} },
			})
    }catch (error) {
      console.log(error);
    }
  }

  async createBlockExclusion(projectId: string, dto: SelectorExclusionDto) {
    try {
      return await this.prismaService.blockExclusion.create({
        data: { ...dto, project: { connect: { id: projectId }}},
      })
    }catch (error) {
      console.log(error);
    }
  }

  async get(projectId: string) {
    try {
      const pageExclusions = await this.prismaService.pageExclusion.findMany({
        where: {projectId: projectId},
        select: {
          id: true,
          pattern: true,
          rule: true,
        }
      })

      const blockExclusions = await this.prismaService.blockExclusion.findMany({
        where: {projectId: projectId},
        select: {
          id: true,
          selector: true,
          description: true,
        }
      })

      return {
        pageExclusions: pageExclusions,
        blockExclusions: blockExclusions,
      }
    } catch(error) {
      throw new Error(error);
    }
  }
}