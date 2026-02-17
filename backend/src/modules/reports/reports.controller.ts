import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportType } from './entities/report.entity';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async findAll(@Request() req: { user: { userId: number } }) {
    return this.reportsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: { user: { userId: number } }) {
    return this.reportsService.findOne(Number(id), req.user.userId);
  }

  @Post()
  async create(
    @Body() body: { title: string; reportType?: ReportType; parameters?: any },
    @Request() req: { user: { userId: number } },
  ) {
    return this.reportsService.create(req.user.userId, body);
  }
}
