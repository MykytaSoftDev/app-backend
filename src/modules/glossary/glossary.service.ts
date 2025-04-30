import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../prisma.service";
import { CreateGlossaryDto } from "./dto/create-glossary.dto";
import { UpdateGlossaryDto } from "./dto/update-glossary.dto";

@Injectable()
export class GlossaryService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: string, projectId: string, dto: CreateGlossaryDto) {
    try {
      const glossary = await this.prismaService.glossary.create({
        data: {
          ...dto,
          user: {
            connect: { id: userId },
          },
          project: {
            connect: { id: projectId },
          },
        }
      })

      return glossary
    }catch (error) {
      throw new Error(error)
    }
  }

  async get(userId: string, projectId: string) {
    return await this.prismaService.glossary.findMany({
      where: {
        userId: userId,
        projectId: projectId,
      },
      select: {
        id: true,
        sourceText: true,
        targetText: true,
        sourceLanguage: true,
        targetLanguages: true,
        behavior: true,
      }
    })
  }

  async update(glossaryId: string, userId: string, projectId: string, dto: UpdateGlossaryDto){
    try {
      const glossary = await this.prismaService.glossary.update({
        where: {
          id: glossaryId,
          userId: userId,
          projectId: projectId
        },
        data: dto
      })

      return glossary
    }catch (error) {
      throw new Error(error);
    }
  }

  async delete(userId: string, projectId: string, glossaryId: string) {
    try {
      return await this.prismaService.glossary.delete({
        where: {
          id: glossaryId,
          userId: userId,
          projectId: projectId
        }
      })
    }catch (error) {
      throw new Error(error);
    }
  }

  async deleteMultiple(userId: string, projectId: string, glossaryIds: string[]) {
    try {
      await this.prismaService.glossary.deleteMany({
        where: {
          id: { in: glossaryIds },
          userId: userId,
          projectId: projectId,
        }
      })
    }catch (error) {
      throw new Error(error);
    }
  }
}
