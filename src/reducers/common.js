import { merge } from 'lodash';
/**
 * Reducer enhancer that adds a clear case
 * This will call the reducer without arguments, relying on the default part of its method signature
 */
export function withClear(TYPE) {
  return (reducer) => {
    return (state, action = {}) => {
      switch (action.type) {
        case TYPE:
          return reducer();
        default:
          return reducer(state, action);
      }
    };
  };
}

/**
 * Reducer enhancer that adds a set case
 * Sets the value of the reducer to `action.data`
 */
export function withSet(TYPE) {
  return (reducer) => {
    return (state, action = {}) => {
      switch (action.type) {
        case TYPE:
          return action.data;
        default:
          return reducer(state, action);
      }
    };
  };
}

/**
 * Reducer enhancer that adds a merge case
 * Merges the value of the reducer with `action.data`
 */
export function withMerge(TYPE) {
  return (reducer) => {
    return (state = {}, action = {}) => {
      switch (action.type) {
        case TYPE:
          return {...merge(state, action.data) };
        default:
          return reducer(state, action);
      }
    };
  };
}
