import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('climat')
export class Climat {
    @PrimaryGeneratedColumn({ name: 'id_climat' })
    id: number;

    @Column({ name: 'type_climat', length: 50 })
    typeClimat: string;

    @Column({ type: 'text', nullable: true })
    description: string;
}
