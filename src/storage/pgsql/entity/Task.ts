import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

export enum Type {
    HTTP = "http",
    OTHER = "other"
}

@Entity()
export class Task {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "enum",
        enum: Type,
        default: Type.HTTP
    })
    type: Type;

    @Column('jsonb')
    config: any;

}
