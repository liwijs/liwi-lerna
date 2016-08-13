import WebsocketStore from './WebsocketStore';
import AbstractCursor from '../store/AbstractCursor';

export default class WebsocketCursor<ModelType> extends AbstractCursor<WebsocketStore<ModelType>> {
    _idCursor: ?number;
    _options: ?Object;
    _result: ?Object;

    constructor(store:WebsocketStore, options) {
        super(store);
        this._options = options;
    }

    /* options */

    limit(newLimit:number):Promise<this> {
        if (this._idCursor) throw new Error('Cursor already created');
        this._options.limit = newLimit;
        return Promise.resolve(this);
    }

    /* results */

    _create() {
        if (this._idCursor) throw new Error('Cursor already created');
        return this.store.connection.emit('createCursor', this._options).then(idCursor => {
            if (!idCursor) return;
            this._idCursor = idCursor;
        });
    }

    emit(type, ...args):Promise {
        if (!this._idCursor) {
            return this._create().then(() => this.emit(type, ...args));
        }

        return this.store.emit('cursor', { type, id: this._idCursor }, args);
    }

    advance(count:number) {
        this.emit('advance', count);
        return this;
    }

    next():Promise<?any> {
        return this.emit('next').then(result => {
            this._result = result;
            this.key = result && result[this._store.keyPath];
            return this.key;
        });
    }

    result():Promise<?ModelType> {
        return Promise.resolve(this._result);
    }

    count(applyLimit:boolean = false) {
        return this.emit('count', applyLimit);
    }

    close():Promise {
        if (!this._store) return Promise.resolve();

        const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
        this._idCursor = this._options = null;
        this._store = this._result = undefined;
        return closedPromise;
    }

    toArray():Promise<Array> {
        return this.store.emit('cursor toArray', this._options, result => {
            this.close();
            return result;
        });
    }
}