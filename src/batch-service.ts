import { Service } from '@gabliam/core';
import { Connection, Repository } from '@gabliam/typeorm';
import { Room } from './entities/room';
import { ScrapService } from './scrap-service';
import { lessonNodeToLesson } from './utils';

@Service()
export class BatchService {
  private roomRepository: Repository<Room>;
  constructor(private scrapService: ScrapService, connection: Connection) {
    this.roomRepository = connection.getRepository(Room);
  }

  async execute() {
    const [rooms, lessonsByRoom] = await this.scrapService.scrap();
    for (const room of rooms) {
      await this.roomRepository.save({
        id: room.id,
        name: room.text,
        lessons: lessonsByRoom[room.id].map((l) => lessonNodeToLesson(l)),
      });
    }
  }
}
