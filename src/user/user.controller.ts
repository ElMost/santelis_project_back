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
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { GetUser } from './get-user.decorator';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  userRepository: any;
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log(loginUserDto);
    console.log('login');
    console.log(loginUserDto.email);
    return this.userService.loginUser(loginUserDto);
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
  async logout(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ message: string }> {
    console.log('logout');
    console.log(loginUserDto);
    // console.log(loginUserDto.email);
    // console.log(loginUserDto.password);
    const user = await this.userService.findOneByEmail(loginUserDto.email);
    console.log(user);

    if (!user) {
      console.log('User not found');

      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    console.log('user: ', user);
    user.refreshToken = null;
    console.log('refreshToken: ', user.refreshToken);
    try {
      // await this.userService.logoutUser(Number(user.id));
      // console.log('User logged out successfully');

      return { message: 'Logout successful' };
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
}
