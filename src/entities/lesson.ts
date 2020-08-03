import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from '@gabliam/typeorm';
import { Room } from './room';

@Entity()
export class Lesson {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Room, room => room.lessons)
  room: Room;

  @Column()
  name: string;

  @Column()
  dayOfWeek: number;

  @Column()
  beginHours: number;

  @Column()
  beginMinutes: number;

  @Column()
  endHours: number;

  @Column()
  endMinutes: number;

  @Column()
  duration: number;

  @Column()
  nbPlace: number;
}
