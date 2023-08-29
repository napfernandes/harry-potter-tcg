import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.SERVER_PORT);

  const appUrl = await app.getUrl();

  console.log(`Application listening to ${appUrl}.`);
}

bootstrap();
