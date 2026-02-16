import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReportType {
    YIELD = 'yield',
    ROI = 'roi',
    SOIL_HEALTH = 'soil_health',
    RECOMMENDATIONS = 'recommendations',
    CUSTOM = 'custom',
}

export enum ReportStatus {
    GENERATING = 'generating',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ type: 'enum', enum: ReportType, name: 'report_type', nullable: true })
    reportType: ReportType;

    @Column()
    title: string;

    @Column({ type: 'json', nullable: true })
    parameters: any;

    @Column({ name: 'file_path', nullable: true })
    filePath: string;

    @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.GENERATING })
    status: ReportStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
