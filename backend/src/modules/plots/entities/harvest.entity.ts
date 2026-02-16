import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Planting } from './planting.entity';

export enum QualityGrade {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

@Entity('harvests')
export class Harvest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'planting_id' })
    plantingId: number;

    @Column({ name: 'harvest_date', type: 'date' })
    harvestDate: Date;

    @Column({ name: 'quantity_kg', type: 'decimal', precision: 10, scale: 2 })
    quantityKg: number;

    @Column({ type: 'enum', enum: QualityGrade, name: 'quality_grade', nullable: true })
    qualityGrade: QualityGrade;

    @Column({ name: 'market_price_per_kg', type: 'decimal', precision: 10, scale: 2, nullable: true })
    marketPricePerKg: number;

    @Column({ name: 'total_revenue', type: 'decimal', precision: 12, scale: 2, nullable: true })
    totalRevenue: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Planting, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'planting_id' })
    planting: Planting;
}
