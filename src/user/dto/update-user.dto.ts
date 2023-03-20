import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  // @Matches(/^[a-zA-Z]+$/gm, {
  //   message: 'Le nom ne doit contenir que des lettres',
  // })
  nom: string;

  @IsNotEmpty()
  @IsString()
  // @Matches(/^[a-zA-Z]+$/gm, {
  //   message: 'Le prenom ne doit contenir que des lettres',
  // })
  prenom: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsOptional()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,64}$/gm, {
    message:
      'mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial',
  })
  password: string;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}
