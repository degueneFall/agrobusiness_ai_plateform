import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
    ALERT = 'alert',
    RECOMMENDATION = 'recommendation',
    SYSTEM = 'system',
    HARVEST = 'harvest',
    IRRIGATION = 'irrigation',
}

export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ type: 'enum', enum: NotificationType, nullable: true })
    type: NotificationType;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ type: 'enum', enum: NotificationPriority, default: NotificationPriority.MEDIUM })
    priority: NotificationPriority;

    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @Column({ name: 'related_entity_type', nullable: true })
    relatedEntityType: string;

    @Column({ name: 'related_entity_id', nullable: true })
    relatedEntityId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
