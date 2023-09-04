import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from 'src/modules/database/module';
import { DataImporterModule } from 'src/modules/data-importer/module';

@Module({
  imports: [
    DatabaseModule,
    DataImporterModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
