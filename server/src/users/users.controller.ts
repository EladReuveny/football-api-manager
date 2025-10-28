import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { UsersService } from './users.service';

@Controller('users')
@ApiBearerAuth('jwtAccessToken')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('jwtAccessToken')
  async getProfile(@User('sub') userId: number) {
    return await this.usersService.getProfile(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific user by ID' })
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific user by ID' })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific user by ID' })
  async remove(@Param('id') id: number) {
    await this.usersService.remove(id);
  }
}
