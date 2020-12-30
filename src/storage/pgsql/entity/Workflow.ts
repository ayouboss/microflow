import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Workflow {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('jsonb')
    definition: any;

}
