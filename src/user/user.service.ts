import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
// import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from './mailerService.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const { nom, prenom, email, password } = createUserDto;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.nom = nom;
    user.prenom = prenom;
    user.email = email;
    user.password = hashPassword;
    user.refreshToken = this.jwtService.sign({ id: user.email });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id: id.toString() } });
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: CreateUserDto): Promise<void> {
    const { nom, prenom, email, password } = updateUserDto;

    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.nom = nom;
    user.prenom = prenom;
    user.email = email;
    user.password = password;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(email: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    console.log('user: ', user);
    if (!user) {
      throw new HttpException('Utilisateur non trouv??', HttpStatus.NOT_FOUND);
    }
    console.log('user: ', user);
    await this.userRepository.delete(user.id);
    console.log(`Utilisateur avec l'ID ${user.id} supprim?? avec succ??s`);
    console.log('user: ', user);
    try {
      await this.userRepository.delete(user.id);
      console.log(`Utilisateur avec l'ID ${user.id} supprim?? avec succ??s`);
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException(
        `Impossible de supprimer l'utilisateur avec l'ID ${user.id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return `Utilisateur avec l'ID ${user.id} supprim?? avec succ??s`;
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    console.log('loginUserDto: ', loginUserDto);
    const { email, password } = loginUserDto;
    console.log('email: ', email);

    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('user profile: ', user);
      const payload = { user };
      console.log('payload: ', payload);
      //Ici envoie du Token d'acc??s si authoris??
      const accessToken = await this.jwtService.sign(payload);
      user.refreshToken = accessToken;
      this.userRepository.save(user);
      console.log('accessToken: ', accessToken);
      return { accessToken };
    } else {
      console.log('Invalid credentials');
      throw new UnauthorizedException(
        'Le couple email/password est incorrect!',
      );
    }
  }

  async isAdmin(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user.isAdmin;
  }

  async logoutUser(userId: number): Promise<User> {
    console.log('userId: ', userId);
    const user = await this.findOne(userId);
    console.log('user: ', user);
    if (!user) {
      console.log('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log('user: ', user);
    user.refreshToken = null;
    console.log('refreshToken: ', user.refreshToken);
    try {
      console.log('user: ', user);
      await this.userRepository.save(user);
      console.log('User logged out successfully');
      return user;
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Invalid credentials');
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    console.log('User validated successfully');
    return user;
  }

  async generateJWT(id: number) {
    console.log('Generating JWT for user with id:', id);
    return sign({ id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  }

  async makeAdmin(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });
    console.log('user: ', user);
    if (!user) {
      throw new HttpException('Utilisateur non trouv??', HttpStatus.NOT_FOUND);
    }
    user.isAdmin = true;
    await this.userRepository.save(user);
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { refreshToken } });
  }
  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.refreshToken = refreshToken;
    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateByEmail(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<unknown> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    try {
      user.nom = updateUserDto.nom;
      user.prenom = updateUserDto.prenom;
      user.email = updateUserDto.email;
      const updatedUser = this.userRepository.save(user);
      if (updatedUser) {
        return updatedUser;
      }
    } catch (err) {
      return err;
    }
  }

  async updatePassword(userId: string, updatePasswordDto: any): Promise<User> {
    console.log(updatePasswordDto);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(updatePasswordDto, salt);

    return await this.userRepository.save(user);
  }

  async sendNewPasswordEmail(
    email: string,
    newPassword: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your new password',
      context: {
        name: 'Dear User',
        password: newPassword,
      },
    });
  }
}
