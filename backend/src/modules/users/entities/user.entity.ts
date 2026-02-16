
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Plot } from '../../plots/entities/plot.entity';

export enum UserRole {
    FARMER = 'farmer',
    AGRONOMIST = 'agronomist',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'password_hash', nullable: true })
    passwordHash: string;

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.FARMER })
    role: UserRole;

    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ name: 'google_id', unique: true, nullable: true })
    googleId: string;

    @Column({ name: 'profile_picture', nullable: true })
    profilePicture: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'last_login', nullable: true })
    lastLogin: Date;

    // Relations will be added as other entities are created
    @OneToMany(() => Plot, (plot) => plot.user)
    plots: Plot[];
}
