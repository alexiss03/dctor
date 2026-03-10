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
import {Treatment} from '../models';
import {TreatmentRepository} from '../repositories';

export class TreatmentController {
  constructor(
    @repository(TreatmentRepository)
    public treatmentRepository: TreatmentRepository,
  ) {}

  @post('/treatments')
  @response(200, {
    description: 'Treatment model instance',
    content: {'application/json': {schema: getModelSchemaRef(Treatment)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Treatment, {
            title: 'NewTreatment',
            exclude: ['id'],
          }),
        },
      },
    })
    treatment: Omit<Treatment, 'id'>,
  ): Promise<Treatment> {
    return this.treatmentRepository.create(treatment);
  }

  @get('/treatments/count')
  @response(200, {
    description: 'Treatment model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Treatment) where?: Where<Treatment>,
  ): Promise<Count> {
    return this.treatmentRepository.count(where);
  }

  @get('/treatments')
  @response(200, {
    description: 'Array of Treatment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Treatment, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Treatment) filter?: Filter<Treatment>,
  ): Promise<Treatment[]> {
    return this.treatmentRepository.find(filter);
  }

  @patch('/treatments')
  @response(200, {
    description: 'Treatment PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Treatment, {partial: true}),
        },
      },
    })
    treatment: Treatment,
    @param.where(Treatment) where?: Where<Treatment>,
  ): Promise<Count> {
    return this.treatmentRepository.updateAll(treatment, where);
  }

  @get('/treatments/{id}')
  @response(200, {
    description: 'Treatment model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Treatment, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Treatment, {exclude: 'where'})
    filter?: FilterExcludingWhere<Treatment>,
  ): Promise<Treatment> {
    return this.treatmentRepository.findById(id, filter);
  }

  @patch('/treatments/{id}')
  @response(204, {
    description: 'Treatment PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Treatment, {partial: true}),
        },
      },
    })
    treatment: Treatment,
  ): Promise<void> {
    await this.treatmentRepository.updateById(id, treatment);
  }

  @put('/treatments/{id}')
  @response(204, {
    description: 'Treatment PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() treatment: Treatment,
  ): Promise<void> {
    await this.treatmentRepository.replaceById(id, treatment);
  }

  @del('/treatments/{id}')
  @response(204, {
    description: 'Treatment DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.treatmentRepository.deleteById(id);
  }
}
