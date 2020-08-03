import { Application, Gabliam } from '@gabliam/core';
import TypeormPlugin from '@gabliam/typeorm';
import * as path from 'path';
import 'reflect-metadata';
import { ScrapService } from './src';
// import { BatchService } from './src/batch-service';

@Application({
  scanPath: __dirname,
  config: path.resolve(__dirname, './config'),
  plugins: [TypeormPlugin],
})
export class App {
  async run(gabliam: Gabliam) {
    // const batchService = gabliam.container.get(BatchService);
    // await batchService.execute();
    const batchService = gabliam.container.get(ScrapService);
    console.log(batchService);
    await batchService.scrap();
  }
}
