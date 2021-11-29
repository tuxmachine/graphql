import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { HelixDriverConfig } from '../../lib';
import { HelixDriver } from '../../lib/drivers';
import { CatsModule } from './cats/cats.module';
import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRootAsync<HelixDriverConfig>({
      driver: HelixDriver,
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
  ],
})
export class AsyncExistingApplicationModule {}
