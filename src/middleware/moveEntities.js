import { get, map, includes, find, isUndefined, reject } from 'lodash';

export const ENTITY_ACTIONS = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
  MOVE: 'MOVE',
};

const ENTITY_TYPES = {
  LIST: 'LIST',
  OBJECT: 'OBJECT',
};

//TODO: Integrate the HOC Reducers we have to manipulate this even more

export function composeMoveEntities(stateKey, entityType = ENTITY_TYPES.LIST) {
  return (reducer) => {
    return function moveEntities(state, action = {}) {
      let initialState;
      if (entityType === ENTITY_TYPES.LIST) {
        initialState = {
          data: [],
        };
      }
      const { data } = action;
      const currentState = state || initialState;
      // grab current data
      const currentData = get(currentState, 'data');
      let mergedData;
      switch (action.type) {
        case `${stateKey}_${ENTITY_ACTIONS.ADD}`:
          if (entityType === ENTITY_TYPES.LIST) {
            // before we add, we need to check if this item exists already
            const hasItem = find(currentData, (item) => {
              return get(item, '_id') === get(data, '_id');
            });
            if (!isUndefined(hasItem)) {
              console.error('Duplicate Entity Insert Attempted. Error, returning original state'); // eslint-disable-line no-console
              return state;
            }
            mergedData = {
              data: [...currentData, data],
            };
            return Object.assign({}, currentState, mergedData);
          }
          return;
        case `${stateKey}_${ENTITY_ACTIONS.UPDATE}`:
          if (entityType === ENTITY_TYPES.LIST) {
            mergedData = {
              data: map(currentData, (item) => {
                if (get(item, '_id') === get(data, '_id')) {
                  return data;
                }
                return item;
              }),
            };
            return Object.assign({}, currentState, mergedData);
          }
          return;
        case `${stateKey}_${ENTITY_ACTIONS.REMOVE}`:
          if (entityType === ENTITY_TYPES.LIST) {
            mergedData = {
              data: reject(currentData, (item) => {
                return get(item, '_id') === data;
              }),
            };
            return Object.assign({}, currentState, mergedData);
          }
          return;
        default:
          return reducer(currentState, action);
      }
    };
  };
}

export function moveEntitiesMiddleware() {
  return (next) => {
    return (action) => {
      const { stateKey, destinationKey, operation, data } = action;
      // by dispatching an operation you have opted in to the entity middleware.
      if (!operation) {
        return next(action);
      }

      if (!stateKey) {
        throw new Error('Must include a stateKey to process actions via Move Entities Middleware');
      }

      // UPDATE/ADD/REMOVE OPERATIONS IN CURRENT STATE TREE
      if (includes([ENTITY_ACTIONS.UPDATE, ENTITY_ACTIONS.ADD, ENTITY_ACTIONS.REMOVE], operation)) {
        return next({
          type: `${stateKey}_${operation}`,
          data,
        });
      }

      // MOVE OPERATION
      if (operation === ENTITY_ACTIONS.MOVE) {
        // first we remove the item from the current state tree
        next({
          type: `${stateKey}_${ENTITY_ACTIONS.REMOVE}`,
          data: get(data, '_id'),
        });
        // next add this item to the destination state tree
        return next({
          type: `${destinationKey}_${ENTITY_ACTIONS.ADD}`,
          data,
        });
      }
    };
  };
}
