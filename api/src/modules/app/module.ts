import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataImporterModule } from '../data-importer/module';
import { DatabaseModule } from '../database/module';

@Module({
  imports: [DatabaseModule, DataImporterModule, ConfigModule.forRoot({})],
})
export class AppModule {}
