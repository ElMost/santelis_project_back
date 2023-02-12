import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { LoginUserDto } from './dto/login-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

  async delete(id: string): Promise<string> {
    console.log('id: ', id);
    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });
    console.log('user: ', user);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }
    console.log('user: ', user);
    await this.userRepository.delete(id);
    console.log(`Utilisateur avec l'ID ${id} supprimé avec succès`);
    console.log('user: ', user);
    try {
      await this.userRepository.delete(id);
      console.log(`Utilisateur avec l'ID ${id} supprimé avec succès`);
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException(
        `Impossible de supprimer l'utilisateur avec l'ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return `Utilisateur avec l'ID ${id} supprimé avec succès`;
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
      //Ici envoie du Token d'accés si authorisé
      const accessToken = await this.jwtService.sign(payload);
      console.log('accessToken: ', accessToken);
      return { accessToken };
    } else {
      console.log('Invalid credentials');
      throw new UnauthorizedException(
        'Le couple email/password est incorrect!',
      );
    }
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
    console.log('User logged out successfully');
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
}
