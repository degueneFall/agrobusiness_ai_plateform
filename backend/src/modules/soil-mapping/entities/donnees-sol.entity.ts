import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Plot } from '../../plots/entities/plot.entity';
import { Sol } from './sol.entity';

@Entity('donnees_sol')
export class DonneesSol {
    @PrimaryGeneratedColumn({ name: 'id_ds' })
    id: number;

    @Column({ name: 'id_parcelle' })
    idParcelle: number;

    @Column({ type: 'float', nullable: true, comment: 'pH du sol' })
    ph: number;

    @Column({ type: 'float', nullable: true, comment: 'Azote (N) en kg/ha' })
    azote: number;

    @Column({ type: 'float', nullable: true, comment: 'Phosphore (P) en kg/ha' })
    phosphore: number;

    @Column({ type: 'float', nullable: true, comment: 'Potassium (K) en kg/ha' })
    potassium: number;

    @Column({ type: 'float', nullable: true, comment: 'Humidité en %' })
    humidite: number;

    @Column({ name: 'id_sol', nullable: true })
    idSol: number;

    @Column({ name: 'date_mesure', type: 'date' })
    dateMesure: Date;

    // Relations
    @ManyToOne(() => Plot, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_parcelle' })
    parcelle: Plot;

    @ManyToOne(() => Sol, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'id_sol' })
    sol: Sol;
}
