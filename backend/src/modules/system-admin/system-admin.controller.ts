import { Controller, Get, UseGuards } from '@nestjs/common';
import { SystemAdminService } from './system-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('system-admin')
export class SystemAdminController {
  constructor(private readonly systemAdminService: SystemAdminService) {}

  @Get('regions')
  @UseGuards(JwtAuthGuard)
  async getRegions() {
    return this.systemAdminService.getRegions();
  }
}
