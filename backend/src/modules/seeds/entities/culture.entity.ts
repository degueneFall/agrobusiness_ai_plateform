import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('cultures')
export class Culture {
    @PrimaryGeneratedColumn({ name: 'id_culture' })
    id: number;

    @Column({ name: 'nom_culture', length: 100 })
    nomCulture: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'duree_cycle', type: 'int', nullable: true, comment: 'Durée du cycle en jours' })
    dureeCycle: number;
}
