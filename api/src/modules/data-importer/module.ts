import { Module } from '@nestjs/common';

import { CardModule } from '../card/module';
import { DataImporterService } from './service';
import { AttributeModule } from '../attribute/module';
import { DataImporterController } from './controller';

@Module({
  imports: [CardModule, AttributeModule],
  providers: [DataImporterService],
  controllers: [DataImporterController],
})
export class DataImporterModule {}
