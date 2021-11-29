import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { HelixDriverConfig } from '../../lib';
import { HelixDriver } from '../../lib/drivers';
import { DirectionsModule } from './directions/directions.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    RecipesModule,
    DirectionsModule,
    GraphQLModule.forRoot<HelixDriverConfig>({
      driver: HelixDriver,
      autoSchemaFile: true,
    }),
  ],
})
export class ApplicationModule {}
