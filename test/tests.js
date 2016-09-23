import { expect } from 'chai';
import { withSet, withClear, composeReducer, withAdd } from '../src';
import { flowRight as compose } from 'lodash';
describe('Reducer Utils', function () {
  it('should compose enhancers together', function () {

    const SET = 'SET';
    const CLEAR = 'CLEAR';

    const reducer = (state = 'default', action = {}) => {
      return state;
    };

    const enhancedReducer = composeReducer(
      withSet(SET),
      withClear(CLEAR),
      reducer,
    );

    const enhancedReducerAlt = compose(
      withSet(SET),
      withClear(CLEAR)
    )(
      reducer
    );

    const actionOne = {
      type: SET,
      data: 'test',
    };

    const actionTwo = {
      type: CLEAR,
    };

    let testState = undefined;
    let testStateAlt = undefined;

    testState = enhancedReducer(testState, actionOne);
    testStateAlt = enhancedReducerAlt(testStateAlt, actionOne);

    expect(testState).to.eql(testStateAlt);

    testState = enhancedReducer(testState, actionTwo);
    testStateAlt = enhancedReducerAlt(testStateAlt, actionTwo);

    expect(testState).to.eql(testStateAlt);
  });

  it('should support set', function () {

    const SET = 'SET';

    const enhancedReducer = composeReducer(
      withSet(SET),
      (state = 0) => state,
    );

    const values = [
      'test one',
      'test two',
      10,
      {foo: 'bar'}
    ];

    let testState = undefined;

    values.forEach(data => {
      testState = enhancedReducer(testState, {
        type: SET,
        data
      });
      expect(testState).to.eql(data);
    });
  });

  it('should support clear', function () {

    const SET = 'SET';
    const CLEAR = 'CLEAR';
    const defaultState = Math.round(1000 * Math.random());

    const enhancedReducer = composeReducer(
      withClear(CLEAR),
      (state = defaultState, action = {}) => {
        switch(action.type) {
          case SET:
            return action.data;
          default:
            return state;
        }
      },
    );

    const values = [
      'test one',
      'test two',
      10,
      {foo: 'bar'}
    ];

    let testState = undefined;

    values.forEach(data => {
      testState = enhancedReducer(testState, {
        type: SET,
        data
      });
      testState = enhancedReducer(testState, {
        type: CLEAR,
      });
      expect(testState).to.eql(defaultState);
    });
  });

  it('should support add', function () {

    const ADD = 'ADD';

    const enhancedReducer = composeReducer(
      withAdd(ADD),
      (state = []) => state,
    );

    const values = [
      'test one',
      'test two',
      10,
      {foo: 'bar'}
    ];

    const valuesClone = [...values];

    // get default
    let testState = enhancedReducer();

    while(valuesClone.length) {
      testState = enhancedReducer(testState, {
        type: ADD,
        data: valuesClone.shift(),
      });
    }

    expect(values).to.eql(testState);

  });

});
