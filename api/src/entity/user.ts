import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_users'})
export class User {

    @PrimaryColumn("text")
    pk?: string;

    @Column("text")
    name?: string;

    @Column("text")
    password?: string;

    @Column("text")
    company?: string;

    @Column("integer")
    createdAt?: number;

    @Column("text")
    email?: string;

    @Column("boolean")
    isAdmin?: boolean;

}
