import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  hash: string;

  @Column({ nullable: true, default: 'EMPLOYEE' })
  roles: string;
}
