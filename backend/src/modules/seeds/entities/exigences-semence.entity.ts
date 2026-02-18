import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Seed } from './seed.entity';

@Entity('exigences_semences')
export class ExigencesSemence {
    @PrimaryGeneratedColumn({ name: 'id_exigence' })
    id: number;

    @Column({ name: 'id_semence' })
    idSemence: number;

    @Column({ name: 'ph_min', type: 'float', nullable: true })
    phMin: number;

    @Column({ name: 'ph_max', type: 'float', nullable: true })
    phMax: number;

    @Column({ name: 'pluie_min', type: 'float', nullable: true, comment: 'Pluviométrie minimale en mm/an' })
    pluieMin: number;

    @Column({ name: 'pluie_max', type: 'float', nullable: true, comment: 'Pluviométrie maximale en mm/an' })
    pluieMax: number;

    @Column({ name: 'temperature_min', type: 'float', nullable: true, comment: 'Température min en °C' })
    temperatureMin: number;

    @Column({ name: 'temperature_max', type: 'float', nullable: true, comment: 'Température max en °C' })
    temperatureMax: number;

    @Column({ name: 'type_sol', length: 50, nullable: true, comment: 'Type de sol recommandé' })
    typeSol: string;

    @Column({ name: 'azote_min', type: 'float', nullable: true, comment: 'Azote minimal requis en kg/ha' })
    azoteMin: number;

    @Column({ name: 'phosphore_min', type: 'float', nullable: true, comment: 'Phosphore minimal requis en kg/ha' })
    phosphoreMin: number;

    @Column({ name: 'potassium_min', type: 'float', nullable: true, comment: 'Potassium minimal requis en kg/ha' })
    potassiumMin: number;

    // Relations
    @OneToOne(() => Seed, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_semence' })
    semence: Seed;
}
