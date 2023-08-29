import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AttributeModel, AttributeSchema } from './model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttributeModel.name, schema: AttributeSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: AttributeModel.name, schema: AttributeSchema },
    ]),
  ],
})
export class AttributeModule {}
