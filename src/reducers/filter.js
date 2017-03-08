import { isUndefined, filter } from 'lodash';

/**
 * Filters value from array, returning what passes the query or the index provided
 * @param state
 * @param query
 * @param index
 * @returns {*}
 */
function filterItem(state, { query, index } = {}) {
  if (!isUndefined(index)) {
    return [state[index]];
  }
  if (isUndefined(query)) {
    return state;
  }
  return filter(state, query);
}

/**
 * Reducer enhancer that adds a filter case
 * actions with index or query will pare the state to the indexes they match
 * leaving out an index or query will return an unchanged state
 */
export default function withFilter(TYPE) {
  return (reducer) => {
    return (state = [], action = {}) => {
      switch (action.type) {
        case TYPE:
          return filterItem(state, action);
        default:
          return reducer(state, action);
      }
    };
  };
}
