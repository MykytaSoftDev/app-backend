import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PageExclusionDto, SelectorExclusionDto } from "./exclusion.dto";
import { WordCounterService } from 'src/services/wordcounter.service'

@Injectable()
export class ExclusionService {

  constructor(
    private prismaService: PrismaService,
    protected wordCounterService: WordCounterService
  ) {}

  async createPageExclusion(userId: string, projectId: string, dto: PageExclusionDto) {
    try {
      const exclusion = await this.prismaService.pageExclusion.create({
				data: { ...dto, project: { connect: { id: projectId }} },
			})
      let condition = {}
      
      switch (dto.rule) {
				case 'equal':
          condition = {
            where: {
              projectId: projectId,
              pageUrl: dto.pattern
            }
          }
          break;
        case 'contain':
          condition = {
            where: {
              projectId: projectId,
              pageUrl: { contains: dto.pattern }
            }
          }
          break;
        case 'start':
          condition = {
            where: {
              projectId: projectId,
              pageUrl: { startWith: dto.pattern }
            }
          }
          break;
        case 'end':
          condition = {
            where: {
              projectId: projectId,
              pageUrl: { endsWith: dto.pattern }
            }
          }
          break;
        default:
          throw new Error('This is not an option for excluding rule.')
			}

      await this.prismaService.page.updateMany({
        data: {
          isExcluded: true
        },
        ...condition,
      })

      await this.wordCounterService.recountProjectWords(userId, projectId)

      return exclusion
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

  async deletePageExclusion(userId: string, exclusionId: string, projectId: string) {
    try {
      const record = await this.prismaService.pageExclusion.delete({
        where: {
          id: exclusionId,
          projectId: projectId,
        }
      })

      console.log(record)
      let condition = {}

      switch (record.rule) {
        case 'equal':
          condition = {
            where: {
              projectId: projectId,
              pageUrl: record.pattern
            }
          }
          break;
        case 'contain':
          condition = {
            where: {
              projectId: projectId,
              pageUrl: { contains: record.pattern }
            }
          }
          break;
        case 'start':
          condition = {
            where: {
              projectId: projectId,
              pageUrl: { startWith: record.pattern }
            }
          }
          break;
        case 'end':
          condition = {
            where: {
              projectId: projectId,
              pageUrl: { endsWith: record.pattern }
            }
          }
          break;
        default:
          throw new Error('This is not an option for excluding rule.')
      }

      await this.prismaService.page.updateMany({
        data: {
          isExcluded: false
        },
        ...condition,
      })

      await this.wordCounterService.recountProjectWords(userId, projectId)

      return record

    }catch (error) {
      throw new Error(error);
    }
  }

  async deleteBlockExclusion(id: string, projectId: string) {
    const result = await this.prismaService.blockExclusion.delete({
      where: {
        id: id,
        projectId: projectId,
      }
    })

    return result
  }

  async deleteMultiplePageExclusions(userId: string, projectId: string, exclusionIds: string[]) {
    try {
      const exclusions = await this.prismaService.pageExclusion.findMany({
        where: {
          id: {in: exclusionIds},
          projectId: projectId
        },
        select: {
          pattern: true,
          rule: true,
        }
      })

      await this.prismaService.pageExclusion.deleteMany({
        where: {
          id: { in: exclusionIds },
          projectId: projectId
        }
      })

      for (const exclusion of exclusions) {
        const { pattern, rule } = exclusion
        let condition = {}

        switch (rule) {
          case 'equal':
            condition = {
              where: {
                projectId: projectId,
                pageUrl: pattern
              }
            }
            break;
          case 'contain':
            condition = {
              where: {
                projectId: projectId,
                pageUrl: { contains: pattern }
              }
            }
            break;
          case 'start':
            condition = {
              where: {
                projectId: projectId,
                pageUrl: { startsWith: pattern }
              }
            }
            break;
          case 'end':
            condition = {
              where: {
                projectId: projectId,
                pageUrl: { endsWith: pattern }
              }
            }
            break;
          default:
            throw new Error('This is not an option for excluding rule.')
        }

        await this.prismaService.page.updateMany({
          data: {
            isExcluded: false
          },
          ...condition,
        })
      }

      await this.wordCounterService.recountProjectWords(userId, projectId)

      return exclusions

    }catch (error) {
      throw new Error(error);
    }

  }

  async deleteMultipleBlockExclusions(projectId: string, exclusionIds: string[]) {
    await this.prismaService.blockExclusion.deleteMany({
      where: {
        projectId: projectId,
        id: {in: exclusionIds},
      }
    })
  }
}