import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sol')
export class Sol {
    @PrimaryGeneratedColumn({ name: 'id_sol' })
    id: number;

    @Column({ name: 'type_sol', length: 50 })
    typeSol: string;

    @Column({ type: 'text', nullable: true })
    description: string;
}
