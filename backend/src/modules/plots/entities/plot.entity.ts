import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Region } from '../../system-admin/entities/region.entity';

export enum SoilType {
    CLAY = 'clay',
    SANDY = 'sandy',
    LOAMY = 'loamy',
    HUMUS = 'humus',
    MIXED = 'mixed',
}

export enum PlotStatus {
    ACTIVE = 'active',
    FALLOW = 'fallow',
    PREPARATION = 'preparation',
}

@Entity('plots')
export class Plot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'region_id', nullable: true })
    regionId: number;

    @Column()
    name: string;

    @Column({ name: 'area_hectares', type: 'decimal', precision: 10, scale: 2 })
    areaHectares: number;

    @Column({ type: 'json', nullable: true })
    coordinates: any;

    @Column({ type: 'enum', enum: SoilType, name: 'soil_type', nullable: true })
    soilType: SoilType;

    @Column({ name: 'soil_ph', type: 'decimal', precision: 3, scale: 1, nullable: true })
    soilPh: number;

    @Column({ name: 'ndvi_score', type: 'decimal', precision: 3, scale: 2, nullable: true })
    ndviScore: number;

    @Column({ name: 'last_ndvi_update', type: 'timestamp', nullable: true })
    lastNdviUpdate: Date;

    @Column({ type: 'enum', enum: PlotStatus, default: PlotStatus.ACTIVE })
    status: PlotStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.plots, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Region, (region) => region.plots, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'region_id' })
    region: Region;
}
