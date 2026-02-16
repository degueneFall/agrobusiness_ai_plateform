import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Plot } from '../../plots/entities/plot.entity';
import { Seed } from '../../seeds/entities/seed.entity';

export enum RecommendationType {
    OPTIMAL = 'optimal',
    SUITABLE = 'suitable',
    ALTERNATIVE = 'alternative',
}

@Entity('ai_recommendations')
export class AiRecommendation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'plot_id' })
    plotId: number;

    @Column({ name: 'seed_id' })
    seedId: number;

    @Column({ name: 'compatibility_score', type: 'decimal', precision: 5, scale: 2 })
    compatibilityScore: number;

    @Column({ type: 'enum', enum: RecommendationType, name: 'recommendation_type', nullable: true })
    recommendationType: RecommendationType;

    @Column({ type: 'json', nullable: true })
    reasoning: any;

    @Column({ name: 'expected_yield', type: 'decimal', precision: 10, scale: 2, nullable: true })
    expectedYield: number;

    @Column({ name: 'confidence_level', type: 'decimal', precision: 3, scale: 2, nullable: true })
    confidenceLevel: number;

    @Column({ name: 'model_version', nullable: true })
    modelVersion: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Plot, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'plot_id' })
    plot: Plot;

    @ManyToOne(() => Seed, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'seed_id' })
    seed: Seed;
}
