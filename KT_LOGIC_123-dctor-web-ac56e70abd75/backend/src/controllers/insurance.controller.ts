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
import {Insurance} from '../models';
import {InsuranceRepository} from '../repositories';

export class InsuranceController {
  constructor(
    @repository(InsuranceRepository)
    public insuranceRepository: InsuranceRepository,
  ) {}

  @post('/insurance')
  @response(200, {
    description: 'Insurance model instance',
    content: {'application/json': {schema: getModelSchemaRef(Insurance)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Insurance, {
            title: 'NewInsurance',
            exclude: ['id'],
          }),
        },
      },
    })
    insurance: Omit<Insurance, 'id'>,
  ): Promise<Insurance> {
    return this.insuranceRepository.create(insurance);
  }

  @get('/insurance/count')
  @response(200, {
    description: 'Insurance model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Insurance) where?: Where<Insurance>,
  ): Promise<Count> {
    return this.insuranceRepository.count(where);
  }

  @get('/insurance')
  @response(200, {
    description: 'Array of Insurance model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Insurance, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Insurance) filter?: Filter<Insurance>,
  ): Promise<Insurance[]> {
    return this.insuranceRepository.find(filter);
  }

  @patch('/insurance')
  @response(200, {
    description: 'Insurance PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Insurance, {partial: true}),
        },
      },
    })
    insurance: Insurance,
    @param.where(Insurance) where?: Where<Insurance>,
  ): Promise<Count> {
    return this.insuranceRepository.updateAll(insurance, where);
  }

  @get('/insurance/{id}')
  @response(200, {
    description: 'Insurance model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Insurance, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Insurance, {exclude: 'where'})
    filter?: FilterExcludingWhere<Insurance>,
  ): Promise<Insurance> {
    return this.insuranceRepository.findById(id, filter);
  }

  @patch('/insurance/{id}')
  @response(204, {
    description: 'Insurance PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Insurance, {partial: true}),
        },
      },
    })
    insurance: Insurance,
  ): Promise<void> {
    await this.insuranceRepository.updateById(id, insurance);
  }

  @put('/insurance/{id}')
  @response(204, {
    description: 'Insurance PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() insurance: Insurance,
  ): Promise<void> {
    await this.insuranceRepository.replaceById(id, insurance);
  }

  @del('/insurance/{id}')
  @response(204, {
    description: 'Insurance DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.insuranceRepository.deleteById(id);
  }
}
