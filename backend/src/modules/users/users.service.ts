import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

function toPublicUser(user: User): Partial<User> {
    const { passwordHash, ...rest } = user;
    return rest;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: any): Promise<User> {
        const { email, password, firstName, lastName, role } = createUserDto;

        const existingUser = await this.findOneByEmail(email);
        if (existingUser) {
            throw new ConflictException('Un compte existe déjà avec cet email.');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = this.usersRepository.create({
            email,
            passwordHash,
            firstName,
            lastName,
            role: role || UserRole.FARMER,
        });

        return this.usersRepository.save(user);
    }

    /** Création d’un utilisateur par un admin (retourne le profil public, sans mot de passe). */
    async createByAdmin(dto: { email: string; password: string; firstName?: string; lastName?: string; role: UserRole }): Promise<Partial<User>> {
        const user = await this.create(dto);
        return toPublicUser(user);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Partial<User>[]> {
        const users = await this.usersRepository.find({
            order: { id: 'ASC' },
        });
        return users.map(toPublicUser);
    }

    async updateRole(id: number, role: UserRole): Promise<Partial<User>> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new ForbiddenException('User not found');
        user.role = role;
        await this.usersRepository.save(user);
        return toPublicUser(user);
    }

    async getMe(userId: number): Promise<Partial<User>> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new ForbiddenException('User not found');
        return toPublicUser(user);
    }

    async updateProfile(userId: number, dto: { firstName?: string; lastName?: string; phone?: string }): Promise<Partial<User>> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new ForbiddenException('User not found');
        if (dto.firstName !== undefined) user.firstName = dto.firstName;
        if (dto.lastName !== undefined) user.lastName = dto.lastName;
        if (dto.phone !== undefined) user.phone = dto.phone;
        await this.usersRepository.save(user);
        return toPublicUser(user);
    }
}
