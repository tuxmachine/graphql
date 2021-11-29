import { HelixPluginFactory, Plugin } from '../../../lib';
import { CatsService } from './cats.service';

@Plugin()
export class RandomCatPlugin implements HelixPluginFactory {
  constructor(private readonly catsService: CatsService) {}

  createPlugin() {
    const { catsService } = this;
    return {
      onContextBuilding({ extendContext }) {
        extendContext({
          cat: catsService.random(),
        });
      },
    };
  }
}
