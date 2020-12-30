import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

export enum State {
    REQUESTED = "requested"
}

@Entity()
export class Log {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type:'uuid', nullable: false })
    trans_id: string

    @Column({
        type: "enum",
        enum: State,
        default: State.REQUESTED
    })
    state: State;

    @Column({ type:'uuid', nullable: true })
    user_id: string;

    @CreateDateColumn({ type: 'timestamp without time zone', default: 'NOW()' })
    createdAt: Date
}
