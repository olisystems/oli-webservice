import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_users'})
export class User {

    @PrimaryColumn()
    pk?: string;

    @Column()
    name?: string;

    @Column()
    password?: string;

    @Column()
    company?: string;

    @Column()
    createdAt?: number;

    @Column()
    email?: string;

    @Column()
    isAdmin?: boolean;

}
