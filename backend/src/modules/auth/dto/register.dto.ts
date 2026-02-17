import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  /** Rôle (optionnel). En inscription publique, non envoyé = farmer. Les admins peuvent créer des comptes avec un autre rôle. */
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
