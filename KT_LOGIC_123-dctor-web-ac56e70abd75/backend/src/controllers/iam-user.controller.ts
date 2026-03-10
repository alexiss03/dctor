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
import {IAMUser} from '../models';
import {IAMUserRepository} from '../repositories';

export class IAMUserController {
  constructor(
    @repository(IAMUserRepository)
    public iamUserRepository : IAMUserRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'IamUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(IAMUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IAMUser, {
            title: 'NewIamUser',
            exclude: ['id'],
          }),
        },
      },
    })
    iamUser: Omit<IAMUser, 'id'>,
  ): Promise<IAMUser> {
    return this.iamUserRepository.create(iamUser);
  }

  @get('/users/count')
  @response(200, {
    description: 'IamUser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(IAMUser) where?: Where<IAMUser>,
  ): Promise<Count> {
    return this.iamUserRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of IamUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(IAMUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(IAMUser) filter?: Filter<IAMUser>,
  ): Promise<IAMUser[]> {
    return this.iamUserRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'IamUser PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IAMUser, {partial: true}),
        },
      },
    })
    iamUser: IAMUser,
    @param.where(IAMUser) where?: Where<IAMUser>,
  ): Promise<Count> {
    return this.iamUserRepository.updateAll(iamUser, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'IamUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(IAMUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(IAMUser, {exclude: 'where'}) filter?: FilterExcludingWhere<IAMUser>
  ): Promise<IAMUser> {
    return this.iamUserRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'IamUser PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IAMUser, {partial: true}),
        },
      },
    })
    iamUser: IAMUser,
  ): Promise<void> {
    await this.iamUserRepository.updateById(id, iamUser);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'IamUser PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() iamUser: IAMUser,
  ): Promise<void> {
    await this.iamUserRepository.replaceById(id, iamUser);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'IamUser DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.iamUserRepository.deleteById(id);
  }
}
