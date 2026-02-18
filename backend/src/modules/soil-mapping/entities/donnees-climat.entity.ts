import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Zone } from '../../system-admin/entities/zone.entity';
import { Climat } from './climat.entity';

@Entity('donnees_climat')
export class DonneesClimat {
    @PrimaryGeneratedColumn({ name: 'id_dc' })
    id: number;

    @Column({ name: 'id_zone' })
    idZone: number;

    @Column({ type: 'float', nullable: true, comment: 'Température en °C' })
    temperature: number;

    @Column({ type: 'float', nullable: true, comment: 'Pluviométrie en mm' })
    pluviometrie: number;

    @Column({ type: 'float', nullable: true, comment: 'Humidité atmosphérique en %' })
    humidite: number;

    @Column({ type: 'float', nullable: true, comment: 'Ensoleillement en heures/jour' })
    ensoleillement: number;

    @Column({ name: 'id_climat', nullable: true })
    idClimat: number;

    @Column({ name: 'date_mesure', type: 'date' })
    dateMesure: Date;

    // Relations
    @ManyToOne(() => Zone, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_zone' })
    zone: Zone;

    @ManyToOne(() => Climat, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'id_climat' })
    climat: Climat;
}
