export default function withLoading(actionType: string): Function {
  return (reducer) => {
    return function (state: boolean = false, action: Object = {}): boolean {
      switch (action.type) {
        case `${actionType}_LOADING_START`:
          return true;
        case `${actionType}_LOADING_END`:
          return false;
        default:
          return reducer(state, action);
      }
    };
  };
}
