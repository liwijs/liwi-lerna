import Logger from 'nightingale-logger';
export { ResourcesServerError } from 'liwi-resources';

var logger = new Logger('liwi:resources:query');

var ClientQuery = /*#__PURE__*/function () {
  function ClientQuery(resourceName, transportClient, key, params) {
    this.resourceName = resourceName;
    this.transportClient = transportClient;
    this.key = key;
    this.params = params;
  }

  var _proto = ClientQuery.prototype;

  _proto.changeParams = function changeParams(params) {
    this.params = params;
  };

  _proto.changePartialParams = function changePartialParams(params) {
    this.params = Object.assign({}, this.params, params);
  };

  _proto.getTransportPayload = function getTransportPayload() {
    return {
      resourceName: this.resourceName,
      key: this.key,
      params: this.params
    };
  };

  _proto.fetch = function fetch(onFulfilled) {
    logger.debug('fetch', {
      resourceName: this.resourceName,
      key: this.key
    });
    return this.transportClient.send('fetch', this.getTransportPayload()).then(onFulfilled);
  };

  _proto.fetchAndSubscribe = function fetchAndSubscribe(callback) {
    logger.debug('fetchAndSubscribe', {
      resourceName: this.resourceName,
      key: this.key
    });
    return this.transportClient.subscribe('fetchAndSubscribe', this.getTransportPayload(), callback);
  };

  _proto.subscribe = function subscribe(callback) {
    logger.debug('subscribe', {
      resourceName: this.resourceName,
      key: this.key
    });
    return this.transportClient.subscribe('subscribe', this.getTransportPayload(), callback);
  };

  return ClientQuery;
}();

var getKeys = function getKeys(o) {
  return Object.keys(o);
};

var createResourceClientService = function createResourceClientService(resourceName, options) {
  return function (transportClient) {
    var queries = {};
    var operations = {};
    getKeys(options.queries).forEach(function (queryKey) {
      queries[queryKey] = function (params) {
        return new ClientQuery(resourceName, transportClient, queryKey, params);
      };
    });
    getKeys(options.operations).forEach(function (operationKey) {
      operations[operationKey] = function (params) {
        return transportClient.send('do', {
          resourceName: resourceName,
          operationKey: operationKey,
          params: params
        });
      };
    });
    return {
      queries: queries,
      operations: operations
    };
  };
};

export { createResourceClientService };
//# sourceMappingURL=index-browser-dev.es.js.map
