import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HelixError } from '../../lib/utils';
import { ApplicationModule } from '../code-first/app.module';

describe('GraphQL - Pipes', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors) =>
          new HelixError('Validation error', { errors }),
      }),
    );
    await app.init();
  });

  it(`should throw an error`, async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query:
          'mutation {\n  addRecipe(newRecipeData: {title: "test", ingredients: []}) {\n    id\n  }\n}\n',
      })
      .expect(200, {
        data: null,
        errors: [
          {
            extensions: {
              errors: [
                {
                  children: [],
                  constraints: {
                    isLength:
                      'description must be longer than or equal to 30 characters',
                  },
                  property: 'description',
                  target: {
                    ingredients: [],
                    title: 'test',
                  },
                },
              ],
            },
            locations: [
              {
                column: 3,
                line: 2,
              },
            ],
            message: 'Validation error',
            path: ['addRecipe'],
          },
        ],
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
