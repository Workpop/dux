export default function withSet(TYPE) {
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
