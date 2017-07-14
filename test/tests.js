import { expect } from 'chai';
import { withSet, withClear, composeAll, withAdd, withMerge } from '../src';
import { flowRight as compose } from 'lodash';
describe('Reducer Utils', function () {
  it('should compose enhancers together', function () {
    const SET = 'SET';
    const CLEAR = 'CLEAR';

    const reducer = (state = 'default', action = {}) => {
      return state;
    };

    const enhancedReducer = composeAll(withSet(SET), withClear(CLEAR))(
      'default'
    );

    const enhancedReducerAlt = compose(withSet(SET), withClear(CLEAR))(reducer);

    const actionOne = {
      type: SET,
      data: 'test',
    };

    const actionTwo = {
      type: CLEAR,
    };

    let testState;
    let testStateAlt;

    testState = enhancedReducer(testState, actionOne);
    testStateAlt = enhancedReducerAlt(testStateAlt, actionOne);

    expect(testState).to.eql(testStateAlt);

    testState = enhancedReducer(testState, actionTwo);
    testStateAlt = enhancedReducerAlt(testStateAlt, actionTwo);

    expect(testState).to.eql(testStateAlt);
  });

  it('should support FSA payloads', function () {
    const MERGE = 'MERGE';

    const enhancedReducer = composeAll(withMerge(MERGE))({});

    const values = [{ foo: 'test one' }, { baz: 10 }];

    let testState;

    values.forEach((data) => {
      testState = enhancedReducer(testState, {
        type: MERGE,
        payload: data,
      });
    });

    expect(testState).to.eql({ foo: 'test one', baz: 10 });
  });

  it('should support merge', function () {
    const MERGE = 'MERGE';

    const enhancedReducer = composeAll(withMerge(MERGE))({});

    const values = [{ foo: 'test one' }, { baz: 10 }];

    let testState;

    values.forEach((data) => {
      testState = enhancedReducer(testState, {
        type: MERGE,
        data,
      });
    });

    expect(testState).to.eql({ foo: 'test one', baz: 10 });
  });

  it('should not mutate original state', function () {
    const MERGE = 'MERGE';

    const enhancedReducer = composeAll(withMerge(MERGE))({});

    const values = [{ foo: 'test one' }, { baz: 10 }];

    let originalState = {};
    let testState = originalState;

    values.forEach((data) => {
      testState = enhancedReducer(testState, {
        type: MERGE,
        data,
      });
    });

    expect(originalState).to.eql({});
  });

  it('should support set', function () {
    const SET = 'SET';

    const enhancedReducer = composeAll(withSet(SET))(0);

    const values = ['test one', 'test two', 10, { foo: 'bar' }];

    let testState;

    values.forEach((data) => {
      testState = enhancedReducer(testState, {
        type: SET,
        data,
      });
      expect(testState).to.eql(data);
    });
  });

  it('should support clear', function () {
    const SET = 'SET';
    const CLEAR = 'CLEAR';
    const defaultState = Math.round(1000 * Math.random());

    const enhancedReducer = composeAll(
      withClear(CLEAR),
      (state = defaultState, action = {}) => {
        switch (action.type) {
          case SET:
            return action.data;
          default:
            return state;
        }
      }
    )(defaultState);

    const values = ['test one', 'test two', 10, { foo: 'bar' }];

    let testState;

    values.forEach((data) => {
      testState = enhancedReducer(testState, {
        type: SET,
        data,
      });
      testState = enhancedReducer(testState, {
        type: CLEAR,
      });
      expect(testState).to.eql(defaultState);
    });
  });

  it('should support add', function () {
    const ADD = 'ADD';

    const enhancedReducer = composeAll(withAdd(ADD))([]);

    const values = ['test one', 'test two', 10, { foo: 'bar' }];

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
