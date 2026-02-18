import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Zone } from '../../system-admin/entities/zone.entity';

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

@Entity('parcelles')
export class Plot {
    @PrimaryGeneratedColumn({ name: 'id_parcelle' })
    id: number;

    @Column({ name: 'id_user' })
    userId: number;

    @Column({ name: 'id_zone', nullable: true })
    regionId: number;

    @Column({ name: 'nom_parcelle' })
    name: string;

    @Column({ name: 'superficie', type: 'decimal', precision: 10, scale: 2 })
    areaHectares: number;

    // Not in schema.sql parcelles TABLE
    /*
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
    */

    @Column({ type: 'enum', enum: PlotStatus, name: 'statut', default: PlotStatus.ACTIVE })
    status: PlotStatus;

    @CreateDateColumn({ name: 'date_creation' })
    createdAt: Date;

    // updated_at is in schema desc (Step 621 didn't show it but schema.sql usually has it, wait step 621 output for parcelles did NOT show updated_at. It showed date_creation. Let's comment this out to be safe or check schema again. Step 621 output: Field: date_creation. No updated_at. Wait, Step 621 output for parcelles table... Field list ends at date_creation. So no updated_at column in parcelles table in DB currently.)
    /*
    @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    */

    @ManyToOne(() => User, (user) => user.plots, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @ManyToOne(() => Zone, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'id_zone' })
    zone: Zone;
}
