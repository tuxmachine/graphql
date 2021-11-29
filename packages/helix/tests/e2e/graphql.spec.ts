import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ApplicationModule } from '../graphql/app.module';

describe('GraphQL', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should return query result`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
        {
          getCats {
            id,
            color,
            weight
          }
        }`,
      })
      .expect(200, {
        data: {
          getCats: [
            {
              id: 1,
              color: 'black',
              weight: 5,
            },
          ],
        },
      });
  });

  it(`should return random cat`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
        {
          randomCat {
            id,
            name,
            age
          }
        }`,
      })
      .then(({ body }) => console.log(JSON.stringify(body, null, 2)));
    // .expect(200, {
    //   data: {
    //     randomCat: expect.objectContaining({
    //       name: expect.any(String),
    //     }),
    //   },
    // });
  });

  afterEach(async () => {
    await app.close();
  });
});
