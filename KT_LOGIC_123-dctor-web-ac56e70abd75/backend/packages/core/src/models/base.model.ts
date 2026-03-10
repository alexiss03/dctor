import {JsonSchemaOptions} from '@loopback/rest';
import {Entity, model, property, AnyObject} from '@loopback/repository';
import {UuidUtils} from '../utils';

export const BaseEntity = (entityName: string) => {
  @model()
  class PrivateBaseEntity extends Entity {
    @property({
      postgresql: {
        columnName: 'created_by_id',
        dataType: 'uuid',
        nullable: 'YES',
      },
    })
    createdById?: string;

    @property({
      type: 'date',
      required: false,
      default: () => new Date(),
      postgresql: {
        columnName: 'create_date',
        dataType: 'timestamp with time zone',
        nullable: 'NO',
      },
    })
    createDate?: Date;

    @property({
      postgresql: {
        columnName: 'last_updated_by_id',
        dataType: 'uuid',
        nullable: 'YES',
      },
    })
    lastUpdatedById?: string;

    @property({
      type: 'date',
      required: false,
      defaultFn: () => new Date(),
      postgresql: {
        columnName: 'last_update_date',
        dataType: 'timestamp with time zone',
        nullable: 'NO',
      },
    })
    lastUpdateDate?: Date;

    @property({
      type: 'date',
      postgresql: {
        columnName: 'delete_date',
        dataType: 'timestamp with time zone',
        nullable: 'YES',
      },
    })
    deleteDate?: Date;

    @property({
      id: true,
      generated: false,
      postgresql: {
        columnName: 'uuid',
        generatedDataType: 'uuid',
        generatedExpression: `(uuid_generate_v5('${UuidUtils.ns(
          entityName,
        )}'::uuid, sequence_id::text)) STORED`,
      },
    })
    id?: string;

    @property({
      type: 'number',
      generated: true,
      postgresql: {
        columnName: 'sequence_id',
      },
    })
    sequenceId?: number;

    // Indexer property to allow additional data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;

    constructor(data?: Partial<PrivateBaseEntity>) {
      super(data);
    }
  }
  return PrivateBaseEntity;
};
