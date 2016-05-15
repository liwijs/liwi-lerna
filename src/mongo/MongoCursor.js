import type MongoStore from './MongoStore';
import type Cursor from 'mongodb/lib/cursor';
import AbstractCursor from '../store/AbstractCursor';

export default class MongoCursor extends AbstractCursor<MongoStore> {
    constructor(store:MongoStore, cursor:Cursor, criteria:Object) {
        super(store);
        this._cursor = cursor;
        this._criteria = criteria;
    }

    advance(count:number):void {
        this._cursor.skip(count);
    }

    next():Promise<any> {
        return this._cursor.next()
            .then(
                value => {
                    this._result = value;
                    this.key = value && value._id;
                    return this.key;
                }
            );
    }

    limit(newLimit:number):Promise {
        this._cursor.limit(newLimit);
        return Promise.resolve();
    }

    count(applyLimit:boolean = false) {
        return this._cursor.count(applyLimit);
    }

    result() {
        return Promise.resolve(this._result);
    }

    close() {
        if (this._cursor) {
            this._cursor.close();
            this._cursor = this._store = this._result = undefined;
        }

        return Promise.resolve();
    }

    toArray():Promise<Array> {
        return this._cursor.toArray();
    }
}
