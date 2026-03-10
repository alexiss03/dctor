import {AnyObject, Model, model, property} from '@loopback/repository';

@model({})
export class MobileSearchFilter extends Model {
    @property({
        type: 'string',
        required: false,
      })
      input: string;

      @property({
        type: 'number',
        required: false,
      })
      minPrice: number;

      @property({
        type: 'number',
        required: false,
      })
      maxPrice: number;

      @property({
        type: 'array',
        itemType: 'string',
        required: false,
      })
      treatments: string[];

      @property({
        type: 'array',
        itemType: 'string',
        required: false,
      })
      insurance: string[];

      @property({
        type: 'array',
        itemType: 'number',
        required: false,
      })
      rating: number[];

      @property({
        type: 'number',
        required: false,
      })
      weekday: number;

      @property({
        type: 'array',
        itemType: 'string',
        required: false,
      })
      availability: string[];

      @property({
        type: 'array',
        itemType: 'string',
        required: false,
      })
      addresses: string[];

}
