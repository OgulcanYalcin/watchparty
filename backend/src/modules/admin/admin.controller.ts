import { Controller, Param, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { ResolveReportDto } from './dto/resolve-report.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('reports')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  reports() {
    return this.adminService.getAllReports();
  }

  @Patch('reports/:id/resolve')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  resolve(@Body() dto: ResolveReportDto, @Param('id') id: string) {
    return this.adminService.resolveReport(id, dto.resolution);
  }

  @Patch('users/:id/suspend')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  suspend(@Param('id') id: string) {
    return this.adminService.suspendUser(id);
  }

  @Patch('users/:id/ban')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  ban(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  stats() {
    return this.adminService.getStats();
  }
}
