import * as moment from 'moment';
import { LessonNode } from './model';
import { Lesson } from './entities/lesson';

export const lessonNodeToLesson = (lessonNode: LessonNode): Partial<Lesson> => {
  const [dayOfWeek, beginHours, beginMinutes] = dateToTimeOfDay(
    lessonNode.beginDate,
  );
  const [, endHours, endMinutes] = dateToTimeOfDay(lessonNode.endDate);
  const duration = moment.duration(lessonNode.duration);
  return {
    name: lessonNode.name,
    beginHours,
    beginMinutes,
    endHours,
    endMinutes,
    dayOfWeek,
    nbPlace: lessonNode.nbPlace,
    duration: duration.get('hours') * 60 + duration.get('minutes'),
  };
};

export const dateToTimeOfDay = (dateStr: string): [number, number, number] => {
  const m = moment(JSON.parse(dateStr));

  return [m.day(), m.hours(), m.minutes()];
};
