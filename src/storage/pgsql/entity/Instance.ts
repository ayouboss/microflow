import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Instance {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    workflow_id: string;

    @Column('jsonb')
    currentJson: any;

    @CreateDateColumn({ type: 'timestamp without time zone', default: 'NOW()' })
    createdAt: Date

}
