import { Module } from '@nestjs/common';

import { CardModule } from '../card/module';
import { GameModule } from '../game/module';
import { DataImporterService } from './service';
import { AttributeModule } from '../attribute/module';
import { DataImporterController } from './controller';

@Module({
  imports: [GameModule, CardModule, AttributeModule],
  providers: [DataImporterService],
  controllers: [DataImporterController],
})
export class DataImporterModule {}
