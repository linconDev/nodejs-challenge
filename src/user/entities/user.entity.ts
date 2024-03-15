import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'USER',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  created_at: string;

  @Column({
    nullable: true,
  })
  updated_at: string;
}
