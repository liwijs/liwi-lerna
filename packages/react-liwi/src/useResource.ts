import { POB_TARGET } from 'pob-babel';
import { Query, QueryParams } from 'liwi-resources-client';
import { ResourceResult } from './createResourceResultFromState';
import { useRetrieveResource } from './useRetrieveResource';
import {
  useRetrieveResourceAndSubscribe,
  UseResourceAndSubscribeOptions,
} from './useRetrieveResourceAndSubscribe';

export interface UseResourceOptions<Params extends QueryParams<Params>> {
  params: Params;
  subscribe?: boolean;
  subscribeOptions?: UseResourceAndSubscribeOptions;
}

export function useResource<Result, Params extends QueryParams<Params>>(
  createQuery: (initialParams: Params) => Query<Result, Params>,
  { params, subscribe, subscribeOptions }: UseResourceOptions<Params>,
  deps: any[],
): ResourceResult<Result, Params> {
  if (POB_TARGET === 'node') {
    return {
      query: undefined as any,
      initialLoading: true,
      initialError: false,
      fetched: false,
      fetching: true,
      data: undefined,
      meta: undefined,
      queryInfo: undefined,
      error: undefined,
    };
  }

  const result = subscribe
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useRetrieveResourceAndSubscribe<Result, Params>(
        createQuery,
        params,
        deps,
        subscribeOptions,
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useRetrieveResource<Result, Params>(createQuery, params, deps);

  return result;
}