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
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { GetUser } from './get-user.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
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
    try {
      const accessToken = await this.userService.loginUser(loginUserDto);
      response.cookie('token', accessToken, { httpOnly: true });
      return {
        message: 'Login successful',
        token: accessToken,
      };
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  @Post('logout')
  async logout(@Res() response: Response): Promise<{ message: string }> {
    response.clearCookie('token');

    return {
      message: 'success',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async findAll(@Body('token') token: string): Promise<unknown> {
    const res = this.jwtService.verify(token);
    const user = await this.userService.findById(res.id);
    try {
      console.log('from user admin', user);
      const isAdmin = await this.userService.isAdmin(user.email);
      if (isAdmin) {
        console.log('from is admin ', isAdmin);
        console.log(this.userService.isAdmin(user.email));
        return await this.userService.findAll();
      } else {
        return {
          message: "you can't access to this data you are not admin",
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<User> {
    console.log(user);

    try {
      return await this.userService.findById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('email/:email')
  async findByIdByEmail(
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
  async resetPassword(
    @Param('email') email: string,
    @Res() response: Response,
  ) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // Generate a new random password
    let newPassword = Math.random().toString(36).slice(-8);
    newPassword =
      newPassword.replace(/[a-z]/, () =>
        String.fromCharCode(Math.floor(Math.random() * 26) + 65),
      ) + '.';
    // Update the user's password
    await this.userService.updatePassword(user.id, newPassword);
    // Send the new password to the user's email
    await this.userService.sendNewPasswordEmail(user.email, newPassword);
    return response.status(HttpStatus.OK).json({
      message: 'A new password has been sent to your email address',
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  async update(
    @Body('id') id: string,
    @Body('updatedFields') updatedFields: UpdateUserDto,
  ) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const updatedUser = await this.userService.updateByEmail(
      user.email,
      updatedFields,
    );

    console.log(updatedUser);
    return {
      message: 'Account updated successfully',
      updatedUser,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:email')
  async delete(@Param('email') email: string, @GetUser() user: User) {
    try {
      console.log(user);
      await this.userService.delete(email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      status: 404,
      message: `Utilisateur avec l'ID ${email} supprimé avec succès`,
    };
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
