import { AbstractConnection } from 'liwi-store';
import mongodb from 'mongodb';
export default class MongoConnection extends AbstractConnection {
    _connection?: mongodb.MongoClient;
    _connecting?: Promise<mongodb.MongoClient>;
    connectionFailed?: boolean;
    constructor(config: Map<string, string | number>);
    connect(connectionString: string): void;
    getConnection(): Promise<mongodb.MongoClient>;
    close(): Promise<void>;
}
//# sourceMappingURL=MongoConnection.d.ts.map