import {
  AnyObject,
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  getJsonSchema,
  getFilterSchemaFor,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {MobileSearchFilter, SearchIndex} from '../models';
import {SearchIndexRepository} from '../repositories';
import { inject } from '@loopback/core';

export class SearchController {
  constructor(
    @repository(SearchIndexRepository)
    public searchIndexRepository : SearchIndexRepository,
    @inject(LoggingBindings.WINSTON_LOGGER)
    private logger: WinstonLogger,
  ) {}

  @post('/api/search')
  @response(200, {
    description: 'Search model instance',
    content: {'application/json': {schema: getModelSchemaRef(SearchIndex)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SearchIndex, {
            title: 'NewSearch',
            exclude: ['id'],
          }),
        },
      },
    })
    search: Omit<SearchIndex, 'id'>,
  ): Promise<SearchIndex> {
    return this.searchIndexRepository.create(search);
  }

  @get('/api/search/count')
  @response(200, {
    description: 'Search model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SearchIndex) where?: Where<SearchIndex>,
  ): Promise<Count> {
    return this.searchIndexRepository.count(where);
  }

  @get('/search')
  @response(200, {
    description: 'Array of Search model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SearchIndex, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SearchIndex)
    filter?: Filter<SearchIndex>,
    @param.query.string('filter-template', {
      description: `
  Supported templates:
  - mobile-search
      `})
    filterTemplate?: string,
    @param.query.object('query', <any>getJsonSchema(MobileSearchFilter))
    mobileQuery?: MobileSearchFilter,
  ): Promise<SearchIndex[]> {
    if(filterTemplate === 'mobile-search')
      filter = await this.searchIndexRepository.mergeMobileSearchFilter(mobileQuery, filter);
    return this.searchIndexRepository.find(filter, {allowExtendedOperators: true});
  }

  @patch('/search')
  @response(200, {
    description: 'Search PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SearchIndex, {partial: true}),
        },
      },
    })
    search: SearchIndex,
    @param.where(SearchIndex) where?: Where<SearchIndex>,
  ): Promise<Count> {
    return this.searchIndexRepository.updateAll(search, where);
  }

  @get('/search/{id}')
  @response(200, {
    description: 'Search model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SearchIndex, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SearchIndex, {exclude: 'where'}) filter?: FilterExcludingWhere<SearchIndex>
  ): Promise<SearchIndex> {
    return this.searchIndexRepository.findById(id, filter);
  }

  @patch('/search/{id}')
  @response(204, {
    description: 'Search PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SearchIndex, {partial: true}),
        },
      },
    })
    search: SearchIndex,
  ): Promise<void> {
    await this.searchIndexRepository.updateById(id, search);
  }

  @put('/search/{id}')
  @response(204, {
    description: 'Search PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() search: SearchIndex,
  ): Promise<void> {
    await this.searchIndexRepository.replaceById(id, search);
  }

  @del('/search/{id}')
  @response(204, {
    description: 'Search DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.searchIndexRepository.deleteById(id);
  }
}
