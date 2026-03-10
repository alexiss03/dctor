import {
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
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Facility} from '../models';
import {FacilityRepository} from '../repositories';

export class FacilityController {
  constructor(
    @repository(FacilityRepository)
    public facilityRepository: FacilityRepository,
  ) {}

  @post('/facilities')
  @response(200, {
    description: 'Facility model instance',
    content: {'application/json': {schema: getModelSchemaRef(Facility)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Facility, {
            title: 'NewFacility',
            exclude: ['id'],
          }),
        },
      },
    })
    facility: Omit<Facility, 'id'>,
  ): Promise<Facility> {
    return this.facilityRepository.create(facility);
  }

  @get('/facilities/count')
  @response(200, {
    description: 'Facility model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Facility) where?: Where<Facility>): Promise<Count> {
    return this.facilityRepository.count(where);
  }

  @get('/facilities')
  @response(200, {
    description: 'Array of Facility model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Facility, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Facility) filter?: Filter<Facility>,
  ): Promise<Facility[]> {
    return this.facilityRepository.find(filter);
  }

  @patch('/facilities')
  @response(200, {
    description: 'Facility PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Facility, {partial: true}),
        },
      },
    })
    facility: Facility,
    @param.where(Facility) where?: Where<Facility>,
  ): Promise<Count> {
    return this.facilityRepository.updateAll(facility, where);
  }

  @get('/facilities/{id}')
  @response(200, {
    description: 'Facility model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Facility, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Facility, {exclude: 'where'})
    filter?: FilterExcludingWhere<Facility>,
  ): Promise<Facility> {
    return this.facilityRepository.findById(id, filter);
  }

  @patch('/facilities/{id}')
  @response(204, {
    description: 'Facility PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Facility, {partial: true}),
        },
      },
    })
    facility: Facility,
  ): Promise<void> {
    await this.facilityRepository.updateById(id, facility);
  }

  @put('/facilities/{id}')
  @response(204, {
    description: 'Facility PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() facility: Facility,
  ): Promise<void> {
    await this.facilityRepository.replaceById(id, facility);
  }

  @del('/facilities/{id}')
  @response(204, {
    description: 'Facility DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.facilityRepository.deleteById(id);
  }
}
