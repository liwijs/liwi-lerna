import { AbstractCursor } from 'liwi-store';
import { BaseModel, QueryOptions } from 'liwi-types';
import AbstractClient from './AbstractClient';

export default class ClientCursor<
  Model extends BaseModel,
  KeyPath extends string,
  Client extends AbstractClient<Model, KeyPath>
> extends AbstractCursor<Model, KeyPath> {
  key: any;

  private _idCursor?: number;

  private client: Client;

  private options: QueryOptions<Model>;

  private _result?: Model;

  public constructor(client: Client, options: QueryOptions<Model>) {
    super();
    this.client = client;
    this.options = options;
  }

  /* options */

  public limit(newLimit: number): Promise<this> {
    if (this._idCursor) throw new Error('Cursor already created');
    this.options.limit = newLimit;
    return Promise.resolve(this);
  }

  /* results */

  _create() {
    if (this._idCursor) throw new Error('Cursor already created');
    return this.client.createCursor(this.options).then((idCursor: number) => {
      if (!idCursor) return;
      this._idCursor = idCursor;
    });
  }

  private emit(type: string, value?: any): Promise<any> {
    if (!this._idCursor) {
      return this._create().then(() => this.emit(type, value));
    }

    return this.client.send('cursor', [type, this._idCursor, value]);
  }

  public advance(count: number) {
    this.emit('advance', count);
    return this;
  }

  public async next(): Promise<any> {
    const result = await this.emit('next');
    this._result = result;
    this.key = result && result[this.client.keyPath];
    return this.key;
  }

  public result(): Promise<Model> {
    if (!this._result) throw new Error('Cannot call result() before next()');
    return Promise.resolve(this._result);
  }

  public count(applyLimit: boolean = false) {
    return this.emit('count', applyLimit);
  }

  public close(): Promise<void> {
    if (!this.client) return Promise.resolve();

    const closedPromise = this._idCursor
      ? this.emit('close')
      : Promise.resolve();
    this._idCursor = undefined;
    this._result = undefined;
    return closedPromise;
  }

  public toArray(): Promise<Model[]> {
    if (this._idCursor) throw new Error('Cursor created, cannot call toArray');
    return this.client.send('cursor toArray', [this.options]);
  }
}
