import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Zone } from '../../system-admin/entities/zone.entity';

@Entity('cartes')
export class Carte {
    @PrimaryGeneratedColumn({ name: 'id_carte' })
    id: number;

    @Column({ name: 'type_carte', length: 50, comment: 'NDVI, pH, humidité, pluviométrie, etc.' })
    typeCarte: string;

    @Column({ name: 'id_zone' })
    idZone: number;

    @Column({ name: 'chemin_fichier', length: 255 })
    cheminFichier: string;

    @Column({ name: 'date_generation', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateGeneration: Date;

    @Column({ type: 'json', nullable: true, comment: 'Paramètres de génération' })
    parametres: any;

    // Relations
    @ManyToOne(() => Zone, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_zone' })
    zone: Zone;
}
