import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CropType {
    CORN = 'corn',
    WHEAT = 'wheat',
    SOYBEAN = 'soybean',
    SUNFLOWER = 'sunflower',
    RICE = 'rice',
    MILLET = 'millet',
    SORGHUM = 'sorghum',
    OTHER = 'other',
}

export enum WaterRequirement {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

@Entity('seeds')
export class Seed {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'variety_code', unique: true, nullable: true })
    varietyCode: string;

    @Column({ type: 'enum', enum: CropType, name: 'crop_type' })
    cropType: CropType;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;

    @Column({ name: 'yield_potential', type: 'decimal', precision: 10, scale: 2, nullable: true })
    yieldPotential: number;

    @Column({ name: 'growth_cycle_days', nullable: true })
    growthCycleDays: number;

    @Column({ type: 'enum', enum: WaterRequirement, name: 'water_requirement', nullable: true })
    waterRequirement: WaterRequirement;

    @Column({ name: 'optimal_soil_type', nullable: true })
    optimalSoilType: string;

    @Column({ name: 'optimal_ph_min', type: 'decimal', precision: 3, scale: 1, nullable: true })
    optimalPhMin: number;

    @Column({ name: 'optimal_ph_max', type: 'decimal', precision: 3, scale: 1, nullable: true })
    optimalPhMax: number;

    @Column({ name: 'drought_resistant', default: false })
    droughtResistant: boolean;

    @Column({ name: 'nitrogen_efficient', default: false })
    nitrogenEfficient: boolean;

    @Column({ type: 'json', nullable: true })
    traits: any;

    @Column({ name: 'price_per_kg', type: 'decimal', precision: 10, scale: 2, nullable: true })
    pricePerKg: number;

    @Column({ nullable: true })
    supplier: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
