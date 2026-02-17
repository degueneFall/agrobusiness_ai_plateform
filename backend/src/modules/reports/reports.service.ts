import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportType, ReportStatus } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepo: Repository<Report>,
  ) {}

  async findAllByUser(userId: number): Promise<Report[]> {
    return this.reportsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Report | null> {
    return this.reportsRepo.findOne({ where: { id, userId } });
  }

  async create(userId: number, data: { title: string; reportType?: ReportType; parameters?: any }): Promise<Report> {
    const report = this.reportsRepo.create({
      userId,
      title: data.title,
      reportType: data.reportType ?? ReportType.CUSTOM,
      parameters: data.parameters ?? {},
      status: ReportStatus.COMPLETED,
    });
    return this.reportsRepo.save(report);
  }
}
