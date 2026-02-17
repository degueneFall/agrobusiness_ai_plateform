import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PlotsService } from './plots.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePlotDto } from './dto/create-plot.dto';

@Controller('plots')
@UseGuards(JwtAuthGuard)
export class PlotsController {
  constructor(private readonly plotsService: PlotsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.plotsService.findAllByUser(req.user.userId);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.plotsService.getStats(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.plotsService.findOne(Number(id), req.user.userId);
  }

  @Post()
  async create(@Body() dto: CreatePlotDto, @Request() req: any) {
    return this.plotsService.create(req.user.userId, dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<CreatePlotDto>, @Request() req: any) {
    return this.plotsService.update(Number(id), req.user.userId, body);
  }
}
