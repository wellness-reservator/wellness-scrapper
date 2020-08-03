import { Entity, PrimaryColumn, Column, OneToMany } from '@gabliam/typeorm';
import { Lesson } from './lesson';

@Entity()
export class Room {
  @PrimaryColumn()
  id: number;


  @Column()
  name: string;

  @OneToMany(type => Lesson, lesson => lesson.room, { cascade: true, eager: true })
  lessons: Lesson[];
}
