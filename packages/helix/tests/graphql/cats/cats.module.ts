import { DynamicModule, Module, Scope } from '@nestjs/common';
import { CatsRequestScopedService } from './cats-request-scoped.service';
import { RandomCatPlugin } from './cats.plugin';
import { CatsResolvers } from './cats.resolvers';
import { CatsService } from './cats.service';

@Module({
  providers: [CatsService, CatsResolvers, RandomCatPlugin],
})
export class CatsModule {
  static enableRequestScope(): DynamicModule {
    return {
      module: CatsModule,
      providers: [
        {
          provide: CatsService,
          useClass: CatsRequestScopedService,
          scope: Scope.REQUEST,
        },
      ],
    };
  }
}
