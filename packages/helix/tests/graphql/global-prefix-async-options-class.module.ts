import { Module } from '@nestjs/common';
import { GqlOptionsFactory, GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { HelixDriverConfig } from '../../lib';
import { HelixDriver } from '../../lib/drivers';
import { CatsModule } from './cats/cats.module';

class ConfigService implements GqlOptionsFactory {
  createGqlOptions(): HelixDriverConfig {
    return {
      typePaths: [join(__dirname, '**', '*.graphql')],
      useGlobalPrefix: true,
    };
  }
}

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRootAsync<HelixDriverConfig>({
      driver: HelixDriver,
      useClass: ConfigService,
    }),
  ],
})
export class GlobalPrefixAsyncOptionsClassModule {}
