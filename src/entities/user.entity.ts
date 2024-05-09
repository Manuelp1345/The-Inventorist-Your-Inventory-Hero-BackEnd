import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Product } from "./product.entity";

@Entity("users")
@Unique(["email"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  username!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 100 })
  email!: string;

  //relacion uno a muchos
  @OneToMany(() => Product, (product) => product.user)
  products!: Product[];
}
