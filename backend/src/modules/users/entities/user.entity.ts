
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Plot } from '../../plots/entities/plot.entity';

export enum UserRole {
    FARMER = 'farmer',
    AGRONOMIST = 'agronomist',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
}

@Entity('utilisateurs')
export class User {
    @PrimaryGeneratedColumn({ name: 'id_user' })
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'mot_de_passe', nullable: true })
    passwordHash: string;

    @Column({ name: 'prenom', nullable: true })
    firstName: string;

    @Column({ name: 'nom', nullable: true })
    lastName: string;

    @Column({ name: 'telephone', nullable: true })
    phone: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.FARMER })
    role: UserRole;

    // Columns below do not exist in schema.sql yet, marking distinctively or removing if strict
    // For now keeping them might cause issues if synchronize is false. 
    // Checking schema.sql, 'utilisateurs' has: id_user, nom, prenom, email, mot_de_passe, role, telephone, date_creation, updated_at.
    // google_id, profile_picture, is_verified, last_login are NOT in schema.sql.
    // I must comment them out or schemas wont match.

    /* 
    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ name: 'google_id', unique: true, nullable: true })
    googleId: string;

    @Column({ name: 'profile_picture', nullable: true })
    profilePicture: string;
    
    @Column({ name: 'last_login', nullable: true })
    lastLogin: Date;
    */

    @CreateDateColumn({ name: 'date_creation' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Plot, (plot) => plot.user)
    plots: Plot[];
}
