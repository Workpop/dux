import { flowRight as compose } from 'lodash';

export { withClear, withSet, withMerge } from './reducers/common';
export { withRemove, withFilter, withAdd, withAddMany, withMergeAt, withSetAt } from './reducers/lists';

export { ENTITY_ACTIONS, composeMoveEntities, moveEntitiesMiddleware } from './middleware/moveEntities';

export { composeMethodReducer, methodMiddleware } from './middleware/methodMiddleware';

export function composeReducer(...args) {
  const reducer = args.pop();
  return compose(...args)(reducer);
}
