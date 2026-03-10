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
import {DoctorReview} from '../models';
import {DoctorReviewRepository} from '../repositories';

export class DoctorReviewController {
  constructor(
    @repository(DoctorReviewRepository)
    public doctorReviewRepository: DoctorReviewRepository,
  ) {}

  @post('/doctor-reviews')
  @response(200, {
    description: 'DoctorReview model instance',
    content: {'application/json': {schema: getModelSchemaRef(DoctorReview)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DoctorReview, {
            title: 'NewDoctorReview',
            exclude: ['id'],
          }),
        },
      },
    })
    doctorReview: Omit<DoctorReview, 'id'>,
  ): Promise<DoctorReview> {
    return this.doctorReviewRepository.create(doctorReview);
  }

  @get('/doctor-reviews/count')
  @response(200, {
    description: 'DoctorReview model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DoctorReview) where?: Where<DoctorReview>,
  ): Promise<Count> {
    return this.doctorReviewRepository.count(where);
  }

  @get('/doctor-reviews')
  @response(200, {
    description: 'Array of DoctorReview model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DoctorReview, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DoctorReview) filter?: Filter<DoctorReview>,
  ): Promise<DoctorReview[]> {
    return this.doctorReviewRepository.find(filter);
  }

  @patch('/doctor-reviews')
  @response(200, {
    description: 'DoctorReview PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DoctorReview, {partial: true}),
        },
      },
    })
    doctorReview: DoctorReview,
    @param.where(DoctorReview) where?: Where<DoctorReview>,
  ): Promise<Count> {
    return this.doctorReviewRepository.updateAll(doctorReview, where);
  }

  @get('/doctor-reviews/{id}')
  @response(200, {
    description: 'DoctorReview model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DoctorReview, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DoctorReview, {exclude: 'where'})
    filter?: FilterExcludingWhere<DoctorReview>,
  ): Promise<DoctorReview> {
    return this.doctorReviewRepository.findById(id, filter);
  }

  @patch('/doctor-reviews/{id}')
  @response(204, {
    description: 'DoctorReview PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DoctorReview, {partial: true}),
        },
      },
    })
    doctorReview: DoctorReview,
  ): Promise<void> {
    await this.doctorReviewRepository.updateById(id, doctorReview);
  }

  @put('/doctor-reviews/{id}')
  @response(204, {
    description: 'DoctorReview PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() doctorReview: DoctorReview,
  ): Promise<void> {
    await this.doctorReviewRepository.replaceById(id, doctorReview);
  }

  @del('/doctor-reviews/{id}')
  @response(204, {
    description: 'DoctorReview DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.doctorReviewRepository.deleteById(id);
  }
}
