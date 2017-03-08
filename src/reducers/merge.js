import { merge } from 'lodash';

/**
 * Reducer enhancer that adds a clear case
 * Merges the value of the reducer with `action.data`
 */
export default function withMerge(TYPE) {
  return (reducer) => {
    return (state = {}, action = {}) => {
      switch (action.type) {
        case TYPE:
          return merge(state, action.data);
        default:
          return reducer(state, action);
      }
    };
  };
}
