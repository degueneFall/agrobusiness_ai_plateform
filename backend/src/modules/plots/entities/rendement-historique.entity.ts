import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Plot } from '../../plots/entities/plot.entity';
import { Seed } from '../../seeds/entities/seed.entity';

@Entity('rendements_historiques')
export class RendementHistorique {
    @PrimaryGeneratedColumn({ name: 'id_rendement' })
    id: number;

    @Column({ name: 'id_parcelle' })
    idParcelle: number;

    @Column({ name: 'id_semence' })
    idSemence: number;

    @Column({ type: 'int' })
    annee: number;

    @Column({ type: 'float', comment: 'Rendement obtenu en tonnes/ha' })
    rendement: number;

    @Column({ name: 'cout_production', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Coût total en FCFA' })
    coutProduction: number;

    @Column({ name: 'prix_vente', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Prix de vente en FCFA/kg' })
    prixVente: number;

    @Column({ name: 'benefice_net', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Bénéfice net en FCFA' })
    beneficeNet: number;

    // Relations
    @ManyToOne(() => Plot, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_parcelle' })
    parcelle: Plot;

    @ManyToOne(() => Seed, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_semence' })
    semence: Seed;
}
