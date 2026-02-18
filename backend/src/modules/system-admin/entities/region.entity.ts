import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Zone } from './zone.entity';

@Entity('regions')
export class Region {
    @PrimaryGeneratedColumn({ name: 'id_region' })
    id: number;

    @Column({ name: 'nom_region' })
    name: string;

    @Column({ name: 'pays', default: 'Sénégal' })
    country: string;

    @OneToMany(() => Zone, (zone) => zone.region)
    zones: Zone[];
}
