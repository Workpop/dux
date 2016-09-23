# dux

Workpop Redux Tools and Composers

These composers can be used in the style of a higher order function to add common reducer transforms to redux stores.

## Usage

```js
import { withSet } from '@workpop/dux';

const SET = 'SET';

const reducer = withSet(SET)((state = 'bar', action = {}) => {
  switch(action.type) {
    // other reducer cases
    default:
      return state;
  }
});

// from redux
const store = createStore(reducer);

// actions like normal
store.dispatch({
    type: SET,
    data: 'foo',
});

// state will be "foo"
```

Using `compose` from `recompose` or `flowRight` from `lodash` will let you chain enhancers together. 

```js
import { flowRight } from 'lodash';
import { withSet, withClear } from '@workpop/dux';

const SET = 'SET';
const CLEAR = 'CLEAR';

const enhancer = flowRight(
  withSet(SET),
  withClear(CLEAR),
);

const reducer = enhancer((state = 'bar', action = {}) => {
  switch(action.type) {
      // other reducer cases
    default:
        return state;
  }
});

const store = createStore(reducer);

store.dispatch({
    type: SET,
    data: 'foo',
});

// state will be "foo"

store.dispatch({
    type: CLEAR,
});

// state will be "bar"
```

Finally, `composeReducer` passes its last argument to the previous combined composers.

```js
import { composeReducer, withSet } from '@workpop/dux';

const SET = 'SET';
const CLEAR = 'CLEAR';

const reducer = composeReducer(
  withClear(CLEAR),
  withSet(SET),
  // reducer is the last argument
  (state = 'bar', action = {}) => {
    switch(action.type) {
      // other reducer cases
      default:
        return state;
    }
  },
);

const store = createStore(reducer);

store.dispatch({
    type: SET,
    data: 'foo',
});

// state will be "foo"

store.dispatch({
    type: CLEAR,
});

// state will be "bar"
```

## Enhancers

TODO

### Lists

TODO

### Common

TODO
