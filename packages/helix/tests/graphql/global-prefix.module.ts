import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { HelixDriverConfig } from '../../lib';
import { HelixDriver } from '../../lib/drivers';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRoot<HelixDriverConfig>({
      driver: HelixDriver,
      typePaths: [join(__dirname, '**', '*.graphql')],
      useGlobalPrefix: true,
    }),
  ],
})
export class GlobalPrefixModule {}
