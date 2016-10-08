import { identity, noop } from 'lodash';

/**
 * higher order reducer for method structures
 * @param featureName
 * @returns {Function}
 */
export function composeMethodReducer(featureName) {
  return (reducer) => {
    return (state = {}, action) => {
      const { type, readyState, data } = action;
      switch (type) {
        case `${featureName}`:
          return {
            data,
            readyState,
          };
        default:
          return reducer(state, action);
      }
    };
  };
}

/**
 * A redux middleware for processing Meteor methods
 * When an action is dispatched, it will pass through our middleware.
 * if denoted a method, we will dispatch the action with readyState of loading
 * The method passed in is then called, and dispatches further ready states for success/error
 * The reducer shape should include { data, readyState } for use in the UI
 * @returns {Function}
 */
export function methodMiddleware() {
  return (next) => {
    return (action) => {
      const { method, type, errorType = type, readyType, transform = identity,  onSuccess = noop, onError = noop, ...rest } = action;
      // if this isnt a method dispatch just go next
      if (!method) {
        return next(action);
      }
      // set loading state
      if (readyType) {
        next({ type: readyType, data: false, ...rest });
      } else if (type) {
        next({ type, readyState: 'loading', ...rest });
      }
      return method((error, result) => {
        if (readyType) {
          next({ type: readyType, data: true, ...rest });
        }
        if (error) {
          onError(error);
          return next({ error: error.reason, type: errorType, readyState: 'error', ...rest });
        }
        // set data and success
        onSuccess(result);
        if (type) {
          return next({data: transform(result), type, readyState: 'success', ...rest});
        }
      });
    };
  };
}
