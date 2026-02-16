import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Plot } from '../../plots/entities/plot.entity';

@Entity('regions')
export class Region {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true, nullable: true })
    code: string;

    @Column({ default: 'Sénégal' })
    country: string;

    @Column({ name: 'climate_zone', nullable: true })
    climateZone: string;

    @Column({ name: 'average_rainfall', type: 'decimal', precision: 10, scale: 2, nullable: true })
    averageRainfall: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Plot, (plot) => plot.region)
    plots: Plot[];
}
