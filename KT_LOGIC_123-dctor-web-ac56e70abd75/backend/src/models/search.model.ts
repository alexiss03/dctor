import {model, Model, property} from '@loopback/repository';
import {BaseEntity} from '@dctor/core';

@model({})
export class SearchIndexTreatment extends Model {

  @property({
    type: 'string',
    required: true,
    id: true,
    postgresql: {
      // dataType: 'uuid',
      dataType: 'character varying',
      dataLength: 64,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
      columnName: 'id',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying',
      dataLength: 256,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      columnName: 'name',
    },
  })
  name: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying',
      dataLength: 40,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      columnName: 'currency',
    },
  })
  currency: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'decimal',
      dataLength: null,
      dataPrecision: 19,
      dataScale: 4,
      nullable: 'NO',
      columnName: 'price',
    },
  })
  price: number;

  constructor(data?: Partial<SearchIndexTreatment>) {
    super(data);
  }

  public static serialize(
    data: Array<SearchIndexTreatment>,
  ): string {
    return JSON.stringify(data);
  }

  public static deserialize(
    data: string,
  ): Array<SearchIndexTreatment> {
    return JSON.parse(data).map(
      (item: Partial<SearchIndexTreatment>) => new SearchIndexTreatment(item)
    );
  }

}

@model({})
export class SearchIndexInsurance extends Model {

  @property({
    type: 'string',
    required: true,
    id: true,
    postgresql: {
      // dataType: 'uuid',
      dataType: 'character varying',
      dataLength: 64,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
      columnName: 'id',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying',
      dataLength: 256,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      columnName: 'name',
    },
  })
  name: string;

  public static serialize(
    data: Array<SearchIndexInsurance>,
  ): string {
    return JSON.stringify(data);
  }

  public static deserialize(
    data: string,
  ): Array<SearchIndexInsurance> {
    return JSON.parse(data).map(
      (item: Partial<SearchIndexInsurance>) => new SearchIndexInsurance(item)
    );
  }
}

@model({})
export class SearchIndexAvailability extends Model {

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'integer',
      columnName: 'weekday',
    },
  })
  weekday: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'time with timezone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
      columnName: 'timeStart',
    },
  })
  timeStart: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'time with timezone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
      columnName: 'timeEnd',
    },
  })
  timeEnd: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying',
      dataLength: 256,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
      columnName: 'rule',
    },
  })
  rule: string;

  public static serialize(
    data: Array<SearchIndexAvailability>,
  ): string {
    return JSON.stringify(data);
  }

  public static deserialize(
    data: string,
  ): Array<SearchIndexAvailability> {
    return JSON.parse(data).map(
      (item: Partial<SearchIndexAvailability>) => new SearchIndexAvailability(item)
    );
  }
}

@model({})
export class SearchIndexAddress extends Model {

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying',
      dataLength: 256,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      columnName: 'addressLine',
    },
  })
  addressLine: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'decimal',
      dataLength: null,
      dataPrecision: 19,
      dataScale: 7,
      nullable: 'NO',
      columnName: 'latitude',
    },
  })
  latitude: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'decimal',
      dataLength: null,
      dataPrecision: 19,
      dataScale: 7,
      nullable: 'NO',
      columnName: 'longitude',
    },
  })
  longitude: number;

  public static serialize(
    data: Array<SearchIndexAddress>,
  ): string {
    return JSON.stringify(data);
  }

  public static deserialize(
    data: string,
  ): Array<SearchIndexAddress> {
    return JSON.parse(data).map(
      (item: Partial<SearchIndexAddress>) => new SearchIndexAddress(item)
    );
  }
}

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'dctor', table: 'search_index'},
    strict: 'filter',
  },
})
export class SearchIndex extends BaseEntity('search_index') {
  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'source_type',
    },
  })
  sourceType: string;

  @property({
    required: true,
    postgresql: {
      dataType: 'uuid',
      columnName: 'source_id',
    },
  })
  sourceId: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (256)',
      columnName: 'name',
    },
  })
  name: string;

  @property({
    type: 'array',
    itemType: SearchIndexTreatment,
    required: true,
    postgresql: {
      dataType: 'json',
      columnName: 'treatments',
    },
  })
  treatments: Array<SearchIndexTreatment>;

  @property({
    type: 'array',
    itemType: SearchIndexInsurance,
    required: true,
    postgresql: {
      dataType: 'json',
      columnName: 'insurance',
    },
  })
  insurance: Array<SearchIndexInsurance>;

  @property({
    type: 'array',
    itemType: SearchIndexAvailability,
    required: true,
    postgresql: {
      dataType: 'json',
      columnName: 'availability',
    },
  })
  availability: Array<SearchIndexAvailability>;

  @property({
    type: 'array',
    itemType: SearchIndexAddress,
    required: true,
    postgresql: {
      dataType: 'json',
      columnName: 'addresses',
    },
  })
  addresses: Array<SearchIndexAddress>;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'decimal',
      dataLength: null,
      dataPrecision: 7,
      dataScale: 4,
      nullable: 'NO',
      columnName: 'rating',
    },
  })
  rating: number;

  constructor(data?: Partial<SearchIndex>) {
    super(data);
  }
}

export interface SearchIndexRelations {
  // describe navigational properties here
}

export type SearchIndexWithRelations = SearchIndex & SearchIndexRelations;
