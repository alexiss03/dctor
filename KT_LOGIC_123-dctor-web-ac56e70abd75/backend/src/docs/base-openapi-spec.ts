import {OpenAPIObject} from '@loopback/openapi-v3';
import {ServerObject} from '@loopback/rest';
import config from 'config';

const open_api_spec: {servers: ServerObject[]} = config.get('openApiSpec');

const BASE_API_SPEC: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'Dctor API Definitions for Mobile and Web Client Subsystem',
    description: `
 ## Where filter

 ### REST API

 In the first form below, the condition is equivalence, that is, it checks whether property equals value. The second form below is for all other conditions.
 \`\`\`
 filter[where][property]=value
 \`\`\`
 \`\`\`
 filter[where][property][op]=value
 \`\`\`
 Where:
 - property is the name of a property (field) in the model being queried.
 - value is a literal value.
 - op is one of the operators listed below.
 For example, in our SearchIndex model, there is a rating property. The following query finds instances where the rating is greater than 3:
 \`\`\`
 GET /api/search?filter[where][rating][gt]=3
 \`\`\`
 Another example, here is a query to find doctors and clinics where rating is less than or equal to 2:
 \`\`\`
 GET /api/search?filter[where][rating][lte]=2
 \`\`\`

 ### Operators
 This table describes the operators available in “where” filters. See [Examples](#examples)  below.

 | Operator | Description |
 |----------|-------------|
 | eq | Equivalence. See [examples](####eq) below.      |
 | and | Logical AND operator. See [AND and OR operators](#and-and-or-operators) and examples below. |
 | or	| Logical OR operator. See AND and OR operators and examples below. |
 | gt, gte | Numerical greater than (>); greater than or equal (>=). Valid only for numerical and date values. See examples below.<br> \
   <br> \
   For Geopoint values, the units are in miles by default. See Geopoint for more information. |
 | lt, lte | Numerical less than (<); less than or equal (<=). Valid only for numerical and date values.<br> \
   <br> \
   For geolocation values, the units are in miles by default. See Geopoint for more information. |
 | between | True if the value is between the two specified values: greater than or equal to first value and less than or equal to second value. See examples below.<br> \
   <br> \
   For geolocation values, the units are in miles by default. See Geopoint for more information. |
 | inq, nin	| In / not in an array of values. See examples below. |
 | near	| For geolocations, return the closest points, sorted in order of distance. Use with limit to return the n closest points. See examples below. |
 | neq | Not equal (!=) |
 | like, nlike | LIKE / NOT LIKE operators for use with regular expressions. The regular expression format depends on the backend data source. See examples below. |
 | like, nlike, options: i | LIKE / NOT LIKE operators for use with regular expressions with the case insensitive flag. The options property set to ‘i’ tells API that it should do case-insensitive matching on the required property. See examples below. |
 | ilike, nilike | ILIKE / NOT ILIKE operators for use with regular expressions. See examples below. |
 | regexp | Regular expression. See examples below. |

 #### AND and OR operators
 Use the AND and OR operators to create compound logical filters based on simple where filter conditions, using the following syntax.

 ##### REST
 \`\`\`
 [where][<and|or>][0]condition1&[where][<and|or>]condition2...
 \`\`\`
 Where *condition1* and *condition2* are a filter conditions.
 See examples below.

 #### Regular expressions
 You can use regular expressions in a where filter, with the following syntax. You can use a regular expression in a where clause for updates and deletes, as well as queries.
 Essentially, regexp is just like an operator in which you provide a regular expression value as the comparison value.

 ##### REST
 \`\`\`
 filter[where][property][regexp]=expression
 \`\`\`
 Where:
 - property is the name of a property (field) in the model being queried.
 - expression is the JavaScript regular expression string. See [Regular Expressions (Mozilla Developer Network)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

 ### Examples

 #### eq
    `,
    termsOfService: 'http://kt-logic.uk/dctor/api/terms/',
    contact: {
      email: 'dctor-info@kt-logic.uk',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  tags: [
    {
      name: 'Administration',
      description: 'Administration endpoints',
      externalDocs: {
        description: 'Find out more',
        url: 'http://kt-logic.uk/dctor/docs/admin',
      },
    },
    {
      name: 'IAM',
      description: 'Identity and access management endpoints',
      externalDocs: {
        description: 'Find out more',
        url: 'http://kt-logic.uk/dctor/docs/iam',
      },
    },
  ],
  servers: [...open_api_spec.servers],
  paths: {},
};

export {BASE_API_SPEC};
