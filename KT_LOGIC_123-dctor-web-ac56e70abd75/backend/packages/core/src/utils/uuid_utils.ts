import {AnyObject} from '@loopback/repository';
import config from 'config';
// import uuidv5 from 'uuid/v5';

export class UuidUtils {
  // public static asUuidv5<T>(id: string | T, namespaceKey?: string): string | T {
  //   if (!id) {
  //     return id;
  //   }
  //   return uuidv5(`${id}`, UuidUtils.ns(namespaceKey));
  // }

  public static ns(namespaceKey?: string): string {
    namespaceKey = namespaceKey || 'default';
    const nsMap = <AnyObject>config.get('uuid_namespace');
    const namespace: string =
      nsMap[namespaceKey] ||
      nsMap['default'] ||
      '00000000-0000-0000-0000-000000000000';
    return namespace;
  }

  public static isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }
}
