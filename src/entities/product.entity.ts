import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";

@Entity("products")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  handle!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  SKU!: string;

  @Column("decimal")
  grams!: number;

  @Column("int")
  stock!: number;

  @Column("decimal")
  price!: number;

  @Column("decimal")
  comparePrice!: number;

  @Column()
  barcode!: string;

  @Column({ default: "active" })
  state!: string;

  //creado por el usuario id many to one
  @ManyToOne(() => User, (user) => user.products)
  user!: User;
}
