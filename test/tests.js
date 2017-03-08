import { expect } from 'chai';
import { withSet, withClear, composeAll, withAdd, withLoading, withBoolean, withRemove, withFilter } from '../src';
import { flowRight as compose } from 'lodash';
describe('Reducer Utils', function () {

  it('should support loading', function () {
    const enhancedReducer = composeAll(
      withLoading('TEST'),
    )(false);

    let testState = undefined;

    const action = {
      type: 'TEST_LOADING_START',
    };

    testState = enhancedReducer(testState, action);

    expect(testState).to.eql(true);
  });

  it('should support boolean', function () {
    const enhancedReducer = composeAll(
      withBoolean('TEST'),
    )(false);

    let testState = undefined;

    const action = {
      type: 'TEST_ENABLED',
    };

    testState = enhancedReducer(testState, action);

    expect(testState).to.eql(true);
  });

  it('should support remove', function () {
    const enhancedReducer = composeAll(
      withRemove('TEST_REMOVE'),
    )([]);

    let testState = ['holyMoly', 'hello', 'goodbye'];

    const action = {
      type: 'TEST_REMOVE',
      index: 1,
    };

    testState = enhancedReducer(testState, action);

    expect(testState).to.eql(['holyMoly', 'goodbye']);
  });

  it('should support filter', function () {
    const enhancedReducer = composeAll(
      withFilter('TEST_FILTER'),
    )([]);

    let testState = ['holyMoly', 'hello', 'goodbye'];

    const action = {
      type: 'TEST_FILTER',
      index: 1,
    };

    testState = enhancedReducer(testState, action);

    expect(testState).to.eql(['hello']);
  });

  it('should compose enhancers together', function () {

    const SET = 'SET';
    const CLEAR = 'CLEAR';

    const reducer = (state = 'default', action = {}) => {
      return state;
    };

    const enhancedReducer = composeAll(
      withSet(SET),
      withClear(CLEAR),
    )('default');

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

    const enhancedReducer = composeAll(
      withSet(SET),
    )(0);

    const values = [
      'test one',
      'test two',
      10,
      { foo: 'bar' }
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

    const enhancedReducer = composeAll(
      withClear(CLEAR, defaultState),
      (state = defaultState, action = {}) => {
        switch (action.type) {
          case SET:
            return action.data;
          default:
            return state;
        }
      }
    )(defaultState);

    const values = [
      'test one',
      'test two',
      10,
      { foo: 'bar' }
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

    const enhancedReducer = composeAll(
      withAdd(ADD),
    )([]);

    const values = [
      'test one',
      'test two',
      10,
      { foo: 'bar' }
    ];

    const valuesClone = [...values];

    // get default
    let testState = enhancedReducer();

    while (valuesClone.length) {
      testState = enhancedReducer(testState, {
        type: ADD,
        data: valuesClone.shift(),
      });
    }

    expect(values).to.eql(testState);

  });

});
