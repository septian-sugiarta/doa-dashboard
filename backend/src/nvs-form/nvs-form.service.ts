import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'; // sesuaikan path-nya kalau beda
import { Prisma } from '@prisma/client';

@Injectable()
export class NvsFormService {
  constructor(private prisma: PrismaService) {}

  // Fungsi untuk menyimpan NVS baru
  create(ncrId: number, dto: any) {
    return this.prisma.nvsForm.create({
      data: {
        ncrId,
        verificationNote: dto.verification_result,
        resultDate: new Date(),
        isEffective: dto.is_effective === 'Effective',
        isReminder: dto.reminder_no ? parseInt(dto.reminder_no, 10) : null,
        verifiedBy: dto.verified_by,
        verifiedDate: new Date(dto.verified_date),
      },
    });
  }

  // Fungsi ambil NVS berdasarkan ncrId
  findByNcrId(ncrId: number) {
    return this.prisma.nvsForm.findFirst({
      where: { ncrId },
    });
  }

  // Opsional: kalau ingin ambil semua data
  findAll() {
    return this.prisma.nvsForm.findMany();
  }
}