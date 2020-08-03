import { Service, Value } from '@gabliam/core';
import * as puppeteer from 'puppeteer';
import { Booking, LessonNode, RoomNode } from './model';
import * as bluebird from 'bluebird';

@Service()
export class ScrapService {
  browser: puppeteer.Browser;

  @Value('application.puppeteer.headless')
  headless: boolean;

  @Value('application.puppeteer.user')
  private user: string;

  @Value('application.puppeteer.password')
  private password: string;

  async start() {
    this.browser = await puppeteer.launch({ headless: this.headless });
  }

  async scrap(): Promise<[RoomNode[], Record<number, LessonNode[]>]> {
    await this.start();
    await this.login();
    const rooms = await this.getRooms();

    const lessonsByRoom: Record<number, LessonNode[]> = {};
    await bluebird.map(rooms, async (room) => {
      lessonsByRoom[room.id] = await this.getProgram(room.id);
    }, { concurrency: 4});


    await this.stop();

    return [rooms, lessonsByRoom];
  }

  async getRooms() {
    const page = await this.browser.newPage();
    await page.goto(
      'https://wellnesssportclub.resamania.fr/onlineV2/index.html#MainBooking/ChooseCategoryBooking',
    );
    await page.waitFor('.x-container');
    const rooms = await page.evaluate((selector: string) => {
      const roomsNode = document.querySelectorAll<HTMLDivElement>(selector);
      const vals: RoomNode[] = [];
      for (const [id, roomNode] of Array.from(roomsNode).entries()) {
        const text = roomNode.innerText.toLocaleLowerCase();
        vals.push({
          id,
          text,
        });
      }
      return vals;
    }, '.contentCategoryMiddleIcon > .item > .text');
    await page.close();
    return rooms;
  }

  async getProgram(roomId: number) {
    const page = await this.browser.newPage();

    await page.goto(
      `https://wellnesssportclub.resamania.fr/onlineV2/index.html#MainBooking/CalendarBooking/${roomId}`,
    );
    await page.waitFor('.x-container');


    const lessonNodes: LessonNode[] = [];
    for (let i = 1; i < 8; i++) {
      await page.click(`#dayList-outerCt > div > div:nth-child(${i})`);
      await page.waitForResponse(<any>(async (response: any) => {
        const url = response.url();
        const method = response.request().method();
        if (url.includes('StoredFileDownload') && method === 'GET') {
          return true;
        }
        return false;
      }));

      const l = await page.evaluate((selector: string) => {
        const lessonsNode = document.querySelectorAll<HTMLDivElement>(selector);
        const vals: LessonNode[] = [];
        for (const lessonNode of Array.from(lessonsNode)) {
          const booking: Booking = (lessonNode as any).booking;
          vals.push({
            name: booking.activity.name,
            beginDate: JSON.stringify(booking.beginDate),
            endDate: JSON.stringify(booking.endDate),
            nbPlace: booking.nbPlace,
            duration: booking.activity.duration,
          });
        }

        return vals;
      }, '.planningline > .lineBookingContainer > .bookingContainer > .innerBookingContainer >.bookingEl');

      lessonNodes.push(...l);
    }

    await page.close();

    return lessonNodes;
  }

  async login() {
    const page = await this.browser.newPage();
    await page.goto('https://wellnesssportclub.resamania.fr/login/');
    await page.waitFor('#container');
    await page.type('#email', this.user);
    await page.type('#password', this.password);
    await page.click(
      '#connect > tbody > tr > td.moo-orangebutton-center > button',
    );
    await page.waitFor('#container');
    await page.close();
  }

  private async stop() {
    await this.browser.close();
  }
}
