import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('historique_actions')
export class HistoriqueAction {
    @PrimaryGeneratedColumn({ name: 'id_action' })
    id: number;

    @Column({ name: 'id_user' })
    idUser: number;

    @Column({ length: 255 })
    action: string;

    @Column({ type: 'text', nullable: true })
    details: string;

    @Column({ name: 'date_action', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateAction: Date;

    // Relations
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_user' })
    user: User;
}
