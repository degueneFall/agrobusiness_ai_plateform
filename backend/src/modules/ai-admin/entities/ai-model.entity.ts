import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AiModelType {
    RECOMMENDATION = 'recommendation',
    YIELD_PREDICTION = 'yield_prediction',
    SOIL_ANALYSIS = 'soil_analysis',
    PEST_DETECTION = 'pest_detection',
}

@Entity('ai_models')
export class AiModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    version: string;

    @Column({ type: 'enum', enum: AiModelType, name: 'model_type', nullable: true })
    modelType: AiModelType;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    accuracy: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'training_date', type: 'timestamp', nullable: true })
    trainingDate: Date;

    @Column({ type: 'json', nullable: true })
    parameters: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
