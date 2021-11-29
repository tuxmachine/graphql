import { ParseIntPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CatsGuard } from './cats.guard';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

const pubSub = new PubSub();

@Resolver('Cat')
export class CatsResolvers {
  constructor(private readonly catsService: CatsService) {}

  @Query()
  @UseGuards(CatsGuard)
  async getCats(@Context() context: any) {
    return await this.catsService.findAll();
  }

  @ResolveField('color')
  getColor() {
    return 'black';
  }

  @ResolveField()
  weight() {
    return 5;
  }

  @Query('cat')
  async findOneById(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<Cat> {
    return await this.catsService.findOneById(id);
  }

  @Query('randomCat')
  async random(@Context() context: any) {
    return context.cat;
  }

  @Mutation('createCat')
  async create(@Args() args: Cat): Promise<Cat> {
    const createdCat = await this.catsService.create(args);
    pubSub.publish('catCreated', { catCreated: createdCat });
    return createdCat;
  }

  @Subscription('catCreated')
  catCreated() {
    return pubSub.asyncIterator('catCreated');
  }
}
