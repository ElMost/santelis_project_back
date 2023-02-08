import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    try {
      return 'This action adds a new user';
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('finally');
    }
  }

  findAll() {
    try {
      return `This action returns all user`;
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('finally');
    }
  }

  findOne(id: number) {
    try {
      return `This action returns a #${id} user`;
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('finally');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log('updateUserDto', updateUserDto);
    try {
      return `This action updates a #${id} user`;
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('finally');
    }
  }

  remove(id: number) {
    try {
      return `This action removes a #${id} user`;
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('finally');
    }
  }
}
