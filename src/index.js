import { flowRight as compose } from 'lodash';

/***************************
 * Higher Order Reducers
 ***************************/
export withMerge from './reducers/merge';
export withSet from './reducers/set';
export withBoolean from './reducers/boolean';
export withLoading from './reducers/loading';
export withClear from './reducers/clear';
export withRemove from './reducers/remove';
export withFilter from './reducers/filter';

export { withAdd, withAddMany, withMergeAt, withSetAt } from './reducers/lists';

/***************************
 * MIDDLEWARE
 ***************************/
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
