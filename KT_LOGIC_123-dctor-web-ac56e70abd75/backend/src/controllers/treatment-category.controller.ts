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
import {TreatmentCategory} from '../models';
import {TreatmentCategoryRepository} from '../repositories';

export class TreatmentCategoryController {
  constructor(
    @repository(TreatmentCategoryRepository)
    public treatmentCategoryRepository : TreatmentCategoryRepository,
  ) {}

  @post('/treatments/categories')
  @response(200, {
    description: 'TreatmentCategory model instance',
    content: {'application/json': {schema: getModelSchemaRef(TreatmentCategory)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TreatmentCategory, {
            title: 'NewTreatmentCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    treatmentCategory: Omit<TreatmentCategory, 'id'>,
  ): Promise<TreatmentCategory> {
    return this.treatmentCategoryRepository.create(treatmentCategory);
  }

  @get('/treatments/categories/count')
  @response(200, {
    description: 'TreatmentCategory model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TreatmentCategory) where?: Where<TreatmentCategory>,
  ): Promise<Count> {
    return this.treatmentCategoryRepository.count(where);
  }

  @get('/treatments/categories')
  @response(200, {
    description: 'Array of TreatmentCategory model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TreatmentCategory, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TreatmentCategory) filter?: Filter<TreatmentCategory>,
  ): Promise<TreatmentCategory[]> {
    return this.treatmentCategoryRepository.find(filter, {allowExtendedOperators: true});
  }

  @patch('/treatments/categories')
  @response(200, {
    description: 'TreatmentCategory PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TreatmentCategory, {partial: true}),
        },
      },
    })
    treatmentCategory: TreatmentCategory,
    @param.where(TreatmentCategory) where?: Where<TreatmentCategory>,
  ): Promise<Count> {
    return this.treatmentCategoryRepository.updateAll(treatmentCategory, where);
  }

  @get('/treatments/categories/{id}')
  @response(200, {
    description: 'TreatmentCategory model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TreatmentCategory, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TreatmentCategory, {exclude: 'where'}) filter?: FilterExcludingWhere<TreatmentCategory>
  ): Promise<TreatmentCategory> {
    return this.treatmentCategoryRepository.findById(id, filter);
  }

  @patch('/treatments/categories/{id}')
  @response(204, {
    description: 'TreatmentCategory PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TreatmentCategory, {partial: true}),
        },
      },
    })
    treatmentCategory: TreatmentCategory,
  ): Promise<void> {
    await this.treatmentCategoryRepository.updateById(id, treatmentCategory);
  }

  @put('/treatments/categories/{id}')
  @response(204, {
    description: 'TreatmentCategory PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() treatmentCategory: TreatmentCategory,
  ): Promise<void> {
    await this.treatmentCategoryRepository.replaceById(id, treatmentCategory);
  }

  @del('/treatments/categories/{id}')
  @response(204, {
    description: 'TreatmentCategory DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.treatmentCategoryRepository.deleteById(id);
  }
}
