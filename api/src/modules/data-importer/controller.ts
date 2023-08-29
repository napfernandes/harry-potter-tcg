import { Controller, Post } from '@nestjs/common';

import { DataImporterService } from './service';

@Controller('/data-importer')
export class DataImporterController {
  constructor(private readonly dataImporterService: DataImporterService) {}

  @Post('import-all')
  async importAllSets(): Promise<string> {
    await this.dataImporterService.importAllSets();

    return 'OK';
  }
}
