import { isUndefined, filter, reject, findIndex, merge } from 'lodash';

/**
 * Rejects values from the array, returning what remains
 * @param state
 * @param query
 * @param index
 * @returns {*}
 */
function rejector(state, {query, index} = {}) {
  if (!isUndefined(index)) {
    return [...state.slice(0, index), ...state.slice(index + 1)];
  }
  if (isUndefined(query)) {
    return [];
  }
  return reject(state, query);
}

/**
 * Filters value from array, returning what passes the query or the index provided
 * @param state
 * @param query
 * @param index
 * @returns {*}
 */
function filterer(state, {query, index} = {}) {
  if (!isUndefined(index)) {
    return [state[index]];
  }
  if (isUndefined(query)) {
    return state;
  }
  return filter(state, query);
}

/**
 * Finds the index given the array state
 * @param state
 * @param query
 * @param index
 * @returns {*}
 */
function findActionIndex(state, {query, index} = {}) {
  if (!isUndefined(index)) {
    if (index < state.length) {
      return index + state.length + 1;
    }
    return index;
  }
  if (isUndefined(query)) {
    return -1;
  }
  return findIndex(state, query);
}

/**
 * Reducer enhancer that adds a remove case
 * actions with index or query will restrict removal to the indexes they match
 * @param TYPE - the REMOVE action
 * @returns {reducerComposer}
 */
export function withRemove(TYPE) {
  return reducer => (state = [], action = {}) => {
    switch (action.type) {
      case TYPE:
        return rejector(state, action);
      default:
        return reducer(state, action);
    }
  };
}

/**
 * Reducer enhancer that adds a filter case
 * actions with index or query will pare the state to the indexes they match
 * leaving out an index or query will return an unchanged state
 * @param TYPE - the FILTER action
 * @returns {reducerComposer}
 */
export function withFilter(TYPE) {
  return reducer => (state = [], action = {}) => {
    switch (action.type) {
      case TYPE:
        return filterer(state, action);
      default:
        return reducer(state, action);
    }
  };
}

/**
 * Reducer enhancer that adds an add case
 * actions with index or query will insert `action.data` at the point that the index is matched
 * @param TYPE - the add action
 * @returns {reducerComposer}
 */
export function withAdd(TYPE) {
  return reducer => (state = [], action = {}) => {
    switch (action.type) {
      case TYPE: {
        const index = findActionIndex(state, action);
        if (index < 0) {
          return [...state, action.data];
        }
        return [...state.slice(0, index), action.data, ...state.slice(index)];
      }
      default:
        return reducer(state, action);
    }
  };
}

/**
 * Reducer enhancer that adds an add many case
 * actions with index or query will insert all `action.data` at the point that the index is matched
 * @param TYPE - add many action
 * @returns {reducerComposer}
 */
export function withAddMany(TYPE) {
  return reducer => (state = [], action = {}) => {
    switch (action.type) {
      case TYPE: {
        const index = findActionIndex(state, action);
        if (index < 0) {
          return [...state, ...action.data];
        }
        return [...state.slice(0, index), ...action.data, ...state.slice(index)];
      }
      default:
        return reducer(state, action);
    }
  };
}

/**
 * Reducer enhancer that adds a merge case
 * actions with index or query will merge `action.data` at the point that the index is matched
 * @param TYPE - merge action
 * @returns {reducerComposer}
 */
export function withMergeAt(TYPE) {
  return reducer => (state = [], action = {}) => {
    switch (action.type) {
      case TYPE: {
        const index = findActionIndex(state, action);
        if (index < 0) {
          return state;
        }
        const merged = merge(state[index], action.data);
        return [...state.slice(0, index), merged, ...state.slice(index + 1)];
      }
      default:
        return reducer(state, action);
    }
  };
}

/**
 * Reducer enhancer that adds a set case
 * actions with index or query will set `action.data` at the point that the index is matched
 * leaving out an index or query will return an unchanged state
 * @param TYPE - set action
 * @returns {reducerComposer}
 */
export function withSetAt(TYPE) {
  return reducer => (state = [], action = {}) => {
    switch (action.type) {
      case TYPE: {
        const index = findActionIndex(state, action);
        if (index < 0) {
          return state;
        }
        return [...state.slice(0, index), action.data, ...state.slice(index + 1)];
      }
      default:
        return reducer(state, action);
    }
  };
}
