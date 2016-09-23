import { flowRight as compose } from 'lodash';

export { withClear, withSet, withMerge } from './containers/reducers/common';
export { withRemove, withFilter, withAdd, withAddMany, withMergeAt, withSetAt } from './containers/reducers/lists';

export function composeReducer(...args) {
  const reducer = args.pop();
  return compose(...args)(reducer);
}
