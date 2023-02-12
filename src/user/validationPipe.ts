import { ValidationError, ValidatorOptions } from 'class-validator';
import { User } from './entities/user.entity';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => User;
}
