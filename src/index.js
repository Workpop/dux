import { flowRight as compose } from 'lodash';

export { withClear, withSet, withMerge } from './reducers/common';
export composeBooleanReducer from './reducers/boolean';
export { withRemove, withFilter, withAdd, withAddMany, withMergeAt, withSetAt } from './reducers/lists';

export { ENTITY_ACTIONS, composeMoveEntities, moveEntitiesMiddleware } from './middleware/moveEntities';

export { composeMethodReducer, methodMiddleware } from './middleware/methodMiddleware';

function baseReducer(initialState) {
  return (state = initialState) => {
    return state;
  };
}

/**
 * Compose many reducers together
 */
export function composeAll(...args) {
  return (initialState) => {
    return compose(...args)(baseReducer(initialState));
  };
}

/**
 * DEPRECATED
 */
export function composeReducer(...args) {
  const reducer = args.pop();
  return compose(...args)(reducer);
}
