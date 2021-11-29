import { Injectable } from '@nestjs/common';
import { join } from 'path';
import {
  HelixDriverConfig,
  HelixDriverConfigFactory,
} from '../../lib/interfaces';

@Injectable()
export class ConfigService implements HelixDriverConfigFactory {
  createGqlOptions(): HelixDriverConfig {
    return {
      typePaths: [join(__dirname, '**', '*.graphql')],
    };
  }
}
