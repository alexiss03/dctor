import {inject} from '@loopback/core';
import {AnyObject, DefaultCrudRepository, Filter, Where} from '@loopback/repository';
import {DctorDbDataSource} from '../datasources';
import {MobileSearchFilter, SearchIndex, SearchIndexRelations} from '../models';

export class SearchIndexRepository extends DefaultCrudRepository<
  SearchIndex,
  typeof SearchIndex.prototype.id,
  SearchIndexRelations
> {
  constructor(
    @inject('datasources.DctorDb') dataSource: DctorDbDataSource,
  ) {
    super(SearchIndex, dataSource);
  }

  public async mergeMobileSearchFilter(mobileQuery?: MobileSearchFilter, filter?: Filter<SearchIndex>): Promise<Filter<SearchIndex>>  {
    filter = filter ?? {};
    filter.where = filter.where ?? {};
    if(mobileQuery) {
      let mobileQryWhere: Where<SearchIndex> = {and: []};
      if(mobileQuery.input) {
        let inputOr: Array<Where<SearchIndex>> = [];
        inputOr.push({
          name: {
            ilike: `${mobileQuery.input}%`
          }
        });
        inputOr.push({
          insurance: {
            jpquery: {
              path: '$[*].name ? (@ starts with $query)',
              vars: {query: mobileQuery.input},
              op: '>',
              value: '0',
              cast: 'integer',
              check_length: 'true',
            },
          }
        });
        inputOr.push({
          treatments: {
            jpquery: {
              path: '$[*].name ? (@ starts with $query)',
              vars: {query: mobileQuery.input},
              op: '>',
              value: '0',
              cast: 'integer',
              check_length: 'true',
            },
          }
        });
        inputOr.push({
          addresses: {
            jpquery: {
              path: '$[*].addressLine ? (@ starts with $query)',
              vars: {query: mobileQuery.input},
              op: '>',
              value: '0',
              cast: 'integer',
              check_length: 'true',
            },
          }
        });
        mobileQryWhere.and.push({or: inputOr});
      }
      if(mobileQuery.insurance && mobileQuery.insurance.length > 0) {
        let jsonQryFilters: Array<string> = [];
        let jsonQryVars: AnyObject = {};

        mobileQuery.insurance.map((insuranceId, index)=>{
          jsonQryFilters.push(`@.id == $insuranceId${index}`);
          jsonQryVars[`insuranceId${index}`] = insuranceId;
        });
        mobileQryWhere.and.push({
          insurance: {
            jpquery: {
              path: `$[*] ? (${jsonQryFilters.join(' || ')})`,
              vars: jsonQryVars,
              op: '>',
              value: '0',
              cast: 'integer',
              check_length: 'true',
            }
          }
        });
      }
      if(mobileQuery.treatments && mobileQuery.treatments.length > 0) {
        let jsonQryFilters: Array<string> = [];
        let jsonQryVars: AnyObject = {};

        mobileQuery.treatments.map((treatmentId, index)=>{
          jsonQryFilters.push(`@.id == $treatmentId${index}`);
          jsonQryVars[`treatmentId${index}`] = treatmentId;
        });
        mobileQryWhere.and.push({
          treatments: {
            jpquery: {
              path: `$[*] ? (${jsonQryFilters.join(' || ')})`,
              vars: jsonQryVars,
              op: '>',
              value: '0',
              cast: 'integer',
              check_length: 'true',
            }
          }
        });
      }
      if(
          mobileQuery.minPrice
          || mobileQuery.minPrice === 0
          || mobileQuery.maxPrice
          || mobileQuery.maxPrice === 0) {
        let jsonQryFilters: Array<string> = [];
        let jsonQryVars: AnyObject = {};
        if(mobileQuery.minPrice) {
          jsonQryFilters.push('@.price >= $minPrice')
          jsonQryVars.minPrice = mobileQuery.minPrice;
        }
        if(mobileQuery.maxPrice) {
          jsonQryFilters.push('@.price <= $maxPrice')
          jsonQryVars.maxPrice = mobileQuery.maxPrice;
        }
        mobileQryWhere.and.push({
          treatments: {
            jpquery: {
              path: `$[*] ? (${jsonQryFilters.join(' && ')})`,
              vars: jsonQryVars,
              op: '>',
              value: '0',
              cast: 'integer',
              check_length: 'true',
            }
          }
        });
      }
      if(mobileQuery.weekday || mobileQuery.weekday === 0) {
        mobileQryWhere.and.push({
          availability: {
            jpquery: {
              path: `$[*] ? (@.weekday == $weekday)`,
              vars: {weekday: mobileQuery.weekday},
              op: '>',
              value: '0',
              cast: 'integer',
              check_length: 'true',
            }
          }
        });
      }
      if(mobileQuery.availability && mobileQuery.availability.length > 0) {
        let jsonQryFilters: Array<string> = [];
        let jsonQryVars: AnyObject = {};

        jsonQryVars[`midnightStart`] = '00:00:00';
        jsonQryVars[`midnightEnd`] = '23:59:59';
        jsonQryVars[`weekday`] = mobileQuery.weekday;

        mobileQuery.availability.map((time, index)=>{
          jsonQryFilters.push(`((${
            [
              ...(
                (mobileQuery.weekday || mobileQuery.weekday === 0) ? [
                  `@.weekday == $weekday`
                ]:[]
              ),
              `@.timeStart <= @.timeEnd`,
              `@.timeStart <= $time${index}`,
              `$time${index} <= @.timeEnd`
            ].join(' && ')
          }) || (${
            [
              ...(
                (mobileQuery.weekday || mobileQuery.weekday === 0) ? [
                  `@.weekday == $weekday`
                ]:[]
              ),
              `@.timeStart > @.timeEnd`,
              `(( \
                  @.timeStart <= $time${index} \
                  && $time${index} <= $midnightEnd \
                ) || ( \
                  $midnightStart <= $time${index} \
                  && $time${index} <= @.timeEnd \
                ))`,
            ].join(' && ')
          }))`);
          jsonQryVars[`time${index}`] = time;
        });
        mobileQryWhere.and.push({
          availability: {
            jpquery: {
              path: `$[*] ? (${jsonQryFilters.join(' || ')})`,
              vars: jsonQryVars,
              op: '>',
              value: '0',
              cast: 'integer',
              check_length: 'true',
            }
          }
        });
      }
      if(mobileQuery.addresses && mobileQuery.addresses.length > 0) {
        let jsonQryFilters: Array<string> = [];
        let jsonQryVars: AnyObject = {};

        mobileQuery.addresses.map((addressQuery, index)=>{
          jsonQryFilters.push(`(@.addressLine like_regex $addressQuery${index} flag "i")`);
          jsonQryVars[`addressQuery${index}`] = `.*${addressQuery}.*`;
        });
        mobileQryWhere.and.push({
          addresses: {
            jpquery: {
              path: `$[*] ? (${jsonQryFilters.join(' || ')})`,
              vars: jsonQryVars,
              op: '>',
              value: '0',
              cast: 'integer',
              check_length: 'true',
            }
          }
        });
      }
      if(mobileQuery.rating && mobileQuery.rating.length > 0) {
        let inputOr: Array<Where<SearchIndex>> = [];
        mobileQuery.rating.map((rating, index)=>{
          inputOr.push({
            rating: {
              gte: rating - 2.5,
              lte: rating + 2.5,
            },
          });
        });
        mobileQryWhere.and.push({or: inputOr});
      }
      if(Object.keys(filter.where).length > 0) {
        if((<any>filter.where).and) {
          (<any>filter.where).and.push(mobileQryWhere);
        } else {
          mobileQryWhere.and.push(filter.where);
          filter.where = mobileQryWhere;
        }
      } else {
        filter.where = mobileQryWhere;
      }
    }
    return filter;
  }
}
