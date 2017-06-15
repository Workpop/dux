/**
 * Selector to get data from an action object
 * Previously, dux was solely used for Workpop Web redux code
 * With the introduction of withReducer from recompose, we want reducers
 * to also be FSA compliant
 */
export function getDataFromAction(action) {
  // Support FSA for withReducer use case
  if (action.payload) {
    return action.payload;
  }
  // Most Workpop data objects do not follow FSA.
  return action.data;
}


export default {
  getDataFromAction,
};
