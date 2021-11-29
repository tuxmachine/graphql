import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { HelixDriver } from '../../lib/drivers';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRoot({
      driver: HelixDriver,
      typePaths: [join(__dirname, '**', '*.graphql')],
      sortSchema: true,
    }),
  ],
})
export class SortSchemaModule {}
