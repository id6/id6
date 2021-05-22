import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { string } from 'joi';
import iso639 from 'iso-639-1';
import { USER_BIO_MAX_LENGTH, USER_NAME_MAX_LENGTH } from '@id6/commons/build/constants';

export const $language = string()
  .valid(...iso639.getAllCodes())
  .optional().empty('')
  .empty(null)
  .default('en');

@Entity('User')
@Index(['authProvider', 'externalUserId'], { unique: true })
@Index(['resetToken', 'resetTokenExpiresAt'])
@Index(['resetToken'], { unique: true })
@Index(['confirmed', 'confirmToken', 'confirmTokenExpiresAt'])
@Index(['confirmToken'], { unique: true })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  authProvider: string;

  @Column()
  externalUserId: string;

  @Column({ length: USER_NAME_MAX_LENGTH })
  name: string;

  @Column({
    length: USER_BIO_MAX_LENGTH,
    nullable: true,
  })
  bio: string;

  @Column({
    nullable: true,
    default: 'en',
  })
  language: string;

  @Column({ nullable: true })
  picture: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
    default: false,
  })
  confirmed: boolean;

  @Column({ nullable: true })
  confirmToken: string;

  @Column({ nullable: true })
  confirmTokenExpiresAt: Date;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpiresAt: Date;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  invalidateTokensAt?: Date;
}

export const $password = string().required().min(6).max(255);
