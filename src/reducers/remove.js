import { isUndefined, reject } from 'lodash';

function rejectItem(state, { query, index } = {}) {
  if (!isUndefined(index)) {
    return [...state.slice(0, index), ...state.slice(index + 1)];
  }
  if (isUndefined(query)) {
    return [];
  }
  return reject(state, query);
}

/**
 * Reducer enhancer that adds a remove case
 * actions with index or query will restrict removal to the indexes they match
 * @param TYPE - the REMOVE action
 */
export default function withRemove(TYPE) {
  return (reducer) => {
    return (state = [], action = {}) => {
      switch (action.type) {
        case TYPE:
          return rejectItem(state, action);
        default:
          return reducer(state, action);
      }
    };
  };
}
