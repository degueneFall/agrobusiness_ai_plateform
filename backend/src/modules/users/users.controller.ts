import { Controller, Get, Post, Patch, Param, UseGuards, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Request() req: { user: { userId: number } }) {
        return this.usersService.getMe(req.user.userId);
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Request() req: { user: { userId: number } }, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async findAll() {
        return this.usersService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async createByAdmin(@Body() dto: CreateUserByAdminDto) {
        return this.usersService.createByAdmin(dto);
    }

    @Patch(':id/role')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.usersService.updateRole(Number(id), dto.role);
    }
}
