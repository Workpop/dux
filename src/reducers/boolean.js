// @flow

/**
 * Bootstrap a reducer to toggle a flag
 * @param actionType
 * @returns {Function}
 */
export default function withBoolean(actionType: string): Function {
  return (reducer: Function): Function => {
    return function (state: boolean = false, action: Object = {}): boolean {
      switch (action.type) {
        case `${actionType}_ENABLED`:
          return true;
        case `${actionType}_DISABLED`:
          return false;
        default:
          return reducer(state, action);
      }
    };
  };
}
