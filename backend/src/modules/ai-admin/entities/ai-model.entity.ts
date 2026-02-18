import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AiModelType {
    RECOMMENDATION = 'recommendation',
    YIELD_PREDICTION = 'yield_prediction',
    SOIL_ANALYSIS = 'soil_analysis',
    PEST_DETECTION = 'pest_detection',
}

@Entity('modeles_ia')
export class AiModel {
    @PrimaryGeneratedColumn({ name: 'id_modele' })
    id: number;

    @Column({ name: 'nom_modele' })
    name: string;

    @Column({ name: 'type_modele', nullable: true })
    modelType: string;

    @Column({ name: 'precision', type: 'float', nullable: true })
    accuracy: number;

    @Column({ name: 'date_entrainement', type: 'date', nullable: true })
    trainingDate: Date;

    @Column({ name: 'hyperparametres', type: 'json', nullable: true })
    parameters: any;

    @Column({ type: 'enum', enum: ['entraînement', 'production', 'archivé'], default: 'entraînement' })
    statut: string;

    // Properties in Entity but not in Table (or different):
    // version, description, isActive are not in schema.sql's modeles_ia.
    // schema.sql has: id_modele, nom_modele, type_modele, precision, date_entrainement, chemin_fichier, hyperparametres, variables_entree, statut.

    @Column({ name: 'version', nullable: true }) // Not in schema, might error if strict. We can remove or leave if column added later.
    version: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at', nullable: true }) // schema lacks created_at
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true }) // logic missing
    updatedAt: Date;
}
