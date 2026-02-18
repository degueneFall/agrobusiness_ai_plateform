import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Region } from '../../system-admin/entities/region.entity';
import { Plot } from '../../plots/entities/plot.entity';

@Entity('zones')
export class Zone {
    @PrimaryGeneratedColumn({ name: 'id_zone' })
    id: number;

    @Column({ name: 'nom_zone', length: 100 })
    nomZone: string;

    @Column({ name: 'id_region' })
    idRegion: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    longitude: number;

    @Column({ type: 'float', nullable: true })
    altitude: number;

    @Column({ name: 'superficie_ha', type: 'float', nullable: true })
    superficieHa: number;

    @Column({ name: 'type_zone', length: 50, nullable: true })
    typeZone: string;

    // Relations
    @ManyToOne(() => Region, (region) => region.zones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_region' })
    region: Region;

    @OneToMany(() => Plot, (plot) => plot.zone)
    plots: Plot[];
}
