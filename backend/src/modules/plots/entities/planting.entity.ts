import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Plot } from './plot.entity';
import { Seed } from '../../seeds/entities/seed.entity';

export enum PlantingStatus {
    PLANNED = 'planned',
    PLANTED = 'planted',
    GROWING = 'growing',
    HARVESTED = 'harvested',
    FAILED = 'failed',
}

@Entity('plantings')
export class Planting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'plot_id' })
    plotId: number;

    @Column({ name: 'seed_id' })
    seedId: number;

    @Column({ name: 'planting_date', type: 'date' })
    plantingDate: Date;

    @Column({ name: 'expected_harvest_date', type: 'date', nullable: true })
    expectedHarvestDate: Date;

    @Column({ name: 'actual_harvest_date', type: 'date', nullable: true })
    actualHarvestDate: Date;

    @Column({ name: 'area_planted', type: 'decimal', precision: 10, scale: 2, nullable: true })
    areaPlanted: number;

    @Column({ name: 'seed_quantity_kg', type: 'decimal', precision: 10, scale: 2, nullable: true })
    seedQuantityKg: number;

    @Column({ type: 'enum', enum: PlantingStatus, default: PlantingStatus.PLANNED })
    status: PlantingStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Plot, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'plot_id' })
    plot: Plot;

    @ManyToOne(() => Seed, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'seed_id' })
    seed: Seed;
}
