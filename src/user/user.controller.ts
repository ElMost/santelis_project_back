import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Res,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { GetUser } from './get-user.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Controller('user')
export class UserController {
  userRepository: any;
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.registerUser(createUserDto);

    const token = this.jwtService.sign({ id: user.email });
    console.log(token);
    response.cookie('token', token, { httpOnly: true });
    return {
      message: 'Register successful',
      token: token,
    };
  }

  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOneByEmail(loginUserDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log(user);
    const token = this.jwtService.sign({ id: user.email });
    await this.userService.updateRefreshToken(user.id, token);
    response.cookie('token', token, { httpOnly: true });
    return {
      message: 'Login successful',
      token: token,
    };
  }

  // async logout(user: User): Promise<User> {
  //   console.log('user: ', user);
  //   if (!user) {
  //     console.log('User not found');
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }
  //   console.log('user: ', user);
  //   user.refreshToken = null;
  //   console.log('refreshToken: ', user.refreshToken);
  //   try {
  //     console.log('user: ', user);
  //     await this.userRepository.save(user);
  //     console.log('User logged out successfully');
  //     return user;
  //   } catch (error) {
  //     console.log('error: ', error);
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Post('logout')
  async logout(@Res() response: Response): Promise<{ message: string }> {
    response.clearCookie('token');

    return {
      message: 'success',
    };
  }

  // @Post('logout')
  // async logout(@Body() loginUserDto: LoginUserDto): Promise<User> {
  //   console.log('logout');

  //   return this.userService.logoutUser(loginUserDto);
  //   // const user = await this.userService.findOneByEmail(loginUserDto.email);
  //   // if (!user) {
  //   //   throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   // }
  //   // await this.userService.logoutUser(user.id);
  //   // return user;
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@GetUser() user: User): Promise<User[]> {
    console.log(user);
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @GetUser() user: User): Promise<User> {
    console.log(user);

    try {
      return await this.userService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('email/:email')
  async findOneByEmail(
    @Param('email') email: string,
    @GetUser() user: User,
  ): Promise<User> {
    console.log(user);
    try {
      return this.userService.findOneByEmail(email);
    } catch (error) {
      console.log(email);
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/forgot-password')
  async ResetPassword(@Body() email: string, @Res() response: Response) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: CreateUserDto,
    @GetUser() user: User,
  ): Promise<void> {
    console.log(user);

    try {
      await this.userService.update(id, {
        nom: updateUserDto.nom,
        prenom: updateUserDto.prenom,
        email: updateUserDto.email,
        password: updateUserDto.password,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    try {
      console.log(user);
      await this.userService.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return `Utilisateur avec l'ID ${id} supprimé avec succès`;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/make-admin/:AdminId/:id')
  async makeAdmin(
    @Param('AdminId') AdminId: string,
    @Param('id') id: string,
  ): Promise<string> {
    const user = await this.userService.findById(AdminId);
    if (!user.isAdmin) {
      throw new HttpException(
        'Only admin users can make other users admin',
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      await this.userService.makeAdmin(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return `Utilisateur avec l'ID ${id} est maintenant admin`;
  }

  @Get('/find-by-token/:token')
  async findByToken(@Param('token') token: string) {
    const user = await this.userService.findByRefreshToken(token);
    return user;
  }
}
