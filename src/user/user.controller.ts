// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('user')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post()
//   create(@Body() createUserDto: CreateUserDto) {
//     return this.userService.create(createUserDto);
//   }

//   @Get()
//   findAll() {
//     return this.userService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.userService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
//     return this.userService.update(+id, updateUserDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.userService.remove(+id);
//   }
// }

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
// import { UserService } from 'src/services/user.service';
import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import * as dotenv from 'dotenv';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
// import { UserDto } from 'src/Dto/UserDto';

dotenv.config();

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto, @Res() response: Response) {
    const hashedPassword = await bcrypt.hash(userDto.password, 12);

    const userCheck = await this.userService.findOne({
      where: { email: userDto.email },
    });

    if (userCheck) {
      throw new BadRequestException('Utilisateur deja enregistré');
    } else {
      const user = await this.userService.create({
        ...userDto,
        password: hashedPassword,
      });

      const token = await this.jwtService.sign({ id: user.email });

      response.cookie('token', token, { httpOnly: true });

      return {
        message: 'Register successful',
        token: token,
      };
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response,
  ) {
    const user = await this.userService.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.jwtService.sign({ id: user.email });

    response.cookie('token', token, { httpOnly: true });

    return {
      message: 'Login successful',
      token: token,
    };
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['token'];
      const data = await this.jwtService.verifyAsync(cookie);
      const email = data['id'];

      if (!data) {
        throw new UnauthorizedException();
      }

      try {
        const user = await this.userService.findOne({ where: { email } });
        const { password, ...result } = user;
        return result;
      } catch (e) {
        throw new BadRequestException('Error finding user');
      }
    } catch (e) {
      throw new BadRequestException('Error processing request');
    }
  }

  @Post('delete')
  async delete(@Req() request: Request) {
    try {
      const cookie = request.cookies['token'];
      const data = await this.jwtService.verifyAsync(cookie);
      const email = data['id'];
      if (!data) {
        throw new UnauthorizedException();
      }

      try {
        const user = await this.userService.findOne({ where: { email } });
        await this.userService.delete(user.id);
        return { message: 'User deleted successfully' };
      } catch (e) {
        throw new BadRequestException('Error deleting user');
      }
    } catch (e) {
      throw new BadRequestException('Error processing request');
    }
  }
}
