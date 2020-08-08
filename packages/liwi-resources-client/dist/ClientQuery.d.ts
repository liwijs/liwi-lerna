import { Query, QuerySubscription, SubscribeCallback, QueryParams, QueryResult } from 'liwi-resources';
import { TransportClient } from './TransportClient';
export default class ClientQuery<Result, Params extends QueryParams<Params> | undefined = undefined> implements Query<Result, Params> {
    private readonly resourceName;
    private readonly transportClient;
    key: string;
    private params;
    constructor(resourceName: string, transportClient: TransportClient, key: string, params: Params);
    changeParams(params: Params): void;
    changePartialParams(params: Params extends undefined ? never : Partial<Params>): void;
    private getTransportPayload;
    fetch<T>(onFulfilled?: (result: QueryResult<Result>) => T): Promise<T>;
    fetchAndSubscribe(callback: SubscribeCallback<any, Result>): QuerySubscription;
    subscribe(callback: SubscribeCallback<any, Result>): QuerySubscription;
}
//# sourceMappingURL=ClientQuery.d.ts.map