import { find, filter, sortBy } from 'lodash';
import { expect } from 'chai';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { moveEntitiesMiddleware, composeMoveEntities, ENTITY_ACTIONS } from '../src/middleware/moveEntities';

function basicReducer(state, action) {
  return state;
}

function sortFunc(data) {
  return sortBy(data, ['name']);
}

const testReducer = composeMoveEntities('test', undefined, sortFunc)(basicReducer);

const rootReducer = combineReducers({
  test: testReducer,
  other: composeMoveEntities('other')(basicReducer),
});

const store = createStore(rootReducer, {
  test: {
    data: [
      {
        _id: '6',
        name: 'Matt',
      },
      {
        _id: '2',
        name: 'Bernardo',
      },
      {
        _id: '1',
        name: 'Abhi',
      },
      {
        _id: '3',
        name: 'Alex',
      },
    ],
  }
}, applyMiddleware(moveEntitiesMiddleware));


describe('Move Entities Middleware', function () {
  it('should throw if no stateKey is passed in', function () {
    function dispatchWithoutStateKey() {
      return store.dispatch({
        type: 'FOO_BAR',
        operation: ENTITY_ACTIONS.UPDATE,
      })
    }

    expect(dispatchWithoutStateKey).to.throw();
  });

  it('update the item in the state tree', function () {
    store.dispatch({
      type: 'TEST_ENTITY_OPERATION',
      operation: ENTITY_ACTIONS.UPDATE,
      stateKey: 'test',
      data: {
        _id: '2',
        name: 'Narddog'
      }
    });
    const test = store.getState().test.data;
    const nard = find(test, (item) => {
      return item._id === '2';
    });
    expect(nard.name).to.eql('Narddog');
  });

  it('add the item to the state tree', function () {
    store.dispatch({
      type: 'TEST_ENTITY_OPERATION',
      operation: ENTITY_ACTIONS.ADD,
      stateKey: 'test',
      data: {
        _id: '4',
        name: 'New'
      }
    });
    const test = store.getState().test.data;
    const newItem = find(test, (item) => {
      return item._id === '4';
    });
    expect(newItem.name).to.eql('New');
  });

  it('should not add duplicate items to the state tree', function () {
    store.dispatch({
      type: 'TEST_ENTITY_OPERATION',
      operation: ENTITY_ACTIONS.ADD,
      stateKey: 'test',
      data: {
        _id: '11',
        name: 'Yo'
      }
    });
    store.dispatch({
      type: 'TEST_ENTITY_OPERATION',
      operation: ENTITY_ACTIONS.ADD,
      stateKey: 'test',
      data: {
        _id: '11',
        name: 'Yo'
      }
    });
    const test = store.getState().test.data;
    const newItem = filter(test, (item) => {
      return item._id === '11';
    });
    expect(newItem.length).to.eql(1);
  });

  it('should remove item from the state tree', function () {
    store.dispatch({
      type: 'TEST_ENTITY_OPERATION',
      operation: ENTITY_ACTIONS.REMOVE,
      stateKey: 'test',
      data: '11',
    });
    const test = store.getState().test.data;
    const newItem = filter(test, (item) => {
      return item._id === '11';
    });
    expect(newItem.length).to.eql(0);
  });

  it('should remove item from current tree and move to destination tree', function () {
    store.dispatch({
      type: 'TEST_ENTITY_OPERATION',
      operation: ENTITY_ACTIONS.MOVE,
      stateKey: 'test',
      destinationKey: 'other',
      data: {
        _id: '1',
        name: 'Abhi'
      },
    });
    const test = store.getState().test.data;
    const other = store.getState().other.data;
    const testMoveItem = find(test, (item) => {
      return item._id === '1';
    });
    const otherMoveItem = find(other, (item) => {
      return item._id === '1';
    });
    expect(testMoveItem).to.eql(undefined);
    expect(otherMoveItem).not.to.eql(undefined);
  });

  it('should sort the newly added item if provided a sort function', function () {
    store.dispatch({
      type: 'TEST_ENTITY_OPERATION',
      operation: ENTITY_ACTIONS.ADD,
      stateKey: 'test',
      data: {
        _id: '5',
        name: 'Kan'
      }
    });
    const test = store.getState().test.data;
    expect(sortFunc(test)).to.eql(test);
  });

  it('should sort the newly moved in item if provided a sort function', function () {
    store.dispatch({
      type: 'TEST_ENTITY_OPERATION',
      operation: ENTITY_ACTIONS.MOVE,
      stateKey: 'other',
      destinationKey: 'test',
      data: {
        _id: '1',
        name: 'Abhi'
      }
    });
    const test = store.getState().test.data;
    const other = store.getState().other.data;
    expect(sortFunc(test)).to.eql(test);
  });
});
