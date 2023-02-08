// import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UserService {
//   create(createUserDto: CreateUserDto) {
//     console.log('createUserDto', createUserDto);
//     try {
//       return 'This action adds a new user';
//     } catch (error) {
//       console.log('error', error);
//     } finally {
//       console.log('finally');
//     }
//   }

//   findAll() {
//     try {
//       return `This action returns all user`;
//     } catch (error) {
//       console.log('error', error);
//     } finally {
//       console.log('finally');
//     }
//   }

//   findOne(id: number) {
//     try {
//       return `This action returns a #${id} user`;
//     } catch (error) {
//       console.log('error', error);
//     } finally {
//       console.log('finally');
//     }
//   }

//   update(id: number, updateUserDto: UpdateUserDto) {
//     console.log('updateUserDto', updateUserDto);
//     try {
//       return `This action updates a #${id} user`;
//     } catch (error) {
//       console.log('error', error);
//     } finally {
//       console.log('finally');
//     }
//   }

//   remove(id: number) {
//     try {
//       return `This action removes a #${id} user`;
//     } catch (error) {
//       console.log('error', error);
//     } finally {
//       console.log('finally');
//     }
//   }
// }

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(data: any): Promise<User> {
    try {
      return await this.userRepository.save(data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(condition: any): Promise<User> {
    try {
      return await this.userRepository.findOne(condition);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
