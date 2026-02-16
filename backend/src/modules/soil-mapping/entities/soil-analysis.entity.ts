import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Plot } from '../../plots/entities/plot.entity';

export enum AnalysisMethod {
    LABORATORY = 'laboratory',
    SENSOR = 'sensor',
    SATELLITE = 'satellite',
}

@Entity('soil_analyses')
export class SoilAnalysis {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'plot_id' })
    plotId: number;

    @Column({ name: 'analysis_date', type: 'date' })
    analysisDate: Date;

    @Column({ name: 'ph_level', type: 'decimal', precision: 3, scale: 1, nullable: true })
    phLevel: number;

    @Column({ name: 'nitrogen_level', type: 'decimal', precision: 10, scale: 2, nullable: true })
    nitrogenLevel: number;

    @Column({ name: 'phosphorus_level', type: 'decimal', precision: 10, scale: 2, nullable: true })
    phosphorusLevel: number;

    @Column({ name: 'potassium_level', type: 'decimal', precision: 10, scale: 2, nullable: true })
    potassiumLevel: number;

    @Column({ name: 'organic_matter', type: 'decimal', precision: 5, scale: 2, nullable: true })
    organicMatter: number;

    @Column({ name: 'moisture_level', type: 'decimal', precision: 5, scale: 2, nullable: true })
    moistureLevel: number;

    @Column({ name: 'ndvi_score', type: 'decimal', precision: 3, scale: 2, nullable: true })
    ndviScore: number;

    @Column({ type: 'enum', enum: AnalysisMethod, name: 'analysis_method', nullable: true })
    analysisMethod: AnalysisMethod;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Plot, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'plot_id' })
    plot: Plot;
}
