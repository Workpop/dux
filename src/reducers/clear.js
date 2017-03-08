/**
 * Reducer enhancer that adds a clear case
 */
export default function withClear(TYPE, initialState) {
  return (reducer) => {
    return (state, action = {}) => {
      switch (action.type) {
        case TYPE:
          return initialState;
        default:
          return reducer(state, action);
      }
    };
  };
}
