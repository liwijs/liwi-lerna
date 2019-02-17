import {
  BaseModel,
  Criteria,
  InsertType,
  QueryOptions,
  Sort,
  Update,
} from 'liwi-types';
import AbstractConnection from './AbstractConnection';
import AbstractStoreCursor from './AbstractStoreCursor';
import AbstractQuery from './AbstractQuery';
import InternalCommonStoreClient from './InternalCommonStoreClient';

export interface UpsertResult<Model extends BaseModel> {
  object: Model;
  inserted: boolean;
}
export default interface Store<
  Model extends BaseModel,
  KeyPath extends string,
  Connection extends AbstractConnection,
  Cursor extends AbstractStoreCursor<Model, KeyPath, any>,
  Query extends AbstractQuery<any>
> extends InternalCommonStoreClient<Model, KeyPath, Cursor> {
  readonly keyPath: KeyPath;

  readonly connection: Connection;

  createQuery(options: QueryOptions<Model>): Query;

  findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<any[]>;

  findByKey(key: any): Promise<Model | undefined>;

  findOne(
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined>;

  cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Cursor>;

  insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;

  replaceOne(object: Model): Promise<Model>;

  replaceSeveral(objects: Model[]): Promise<Model[]>;

  upsertOne(object: InsertType<Model, KeyPath>): Promise<Model>;

  upsertOneWithInfo(
    object: InsertType<Model, KeyPath>,
  ): Promise<UpsertResult<Model>>;

  partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;

  partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;

  partialUpdateMany(
    criteria: Criteria<Model>,
    partialUpdate: Update<Model>,
  ): Promise<void>;

  deleteByKey(key: any): Promise<void>;

  deleteOne(object: Model): Promise<void>;

  deleteMany(selector: Criteria<Model>): Promise<void>;
}
