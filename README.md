# React Redux Driver

[![npm version](https://badge.fury.io/js/react-redux-driver.svg)](https://badge.fury.io/js/react-redux-driver)
[![build status](https://travis-ci.org/aeldarex/react-redux-driver.svg?branch=master)](https://travis-ci.org/aeldarex/react-redux-driver)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/aeldarex/react-redux-driver/blob/master/README.md)

A set of reducer functions, dispatchable actions, and selector creators to simplify CRUD operations with react-redux.

## Installation

```
npm install --save react-redux-driver
```

## Adding the Reducer

First step is to add the driver reducer to your root reducer. The driver reducer will provide basic handling of all actions dispatched by the included dispatch functions. Below i've added an example of what this might look like inside a root reducer alongside some other custom reducers.

```javascript
import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import { driverReducer } from 'react-redux-driver';
import { customReducer1, customReducer2 } from './reducers';

const combinedReducer = combineReducers({
  customSection1: customReducer1,
  customSection2: customReducer2
});

const rootReducer = reduceReducers(combinedReducer, driverReducer);

export default rootReducer;
```

The main takeaway is that it's important for the driverReducer to operate at the **top-level** of the state. If you are unfamiliar with the syntax above checkout out the github for [reduce-reducers](https://github.com/redux-utilities/reduce-reducers) as well as this [stack overflow](https://stackoverflow.com/questions/38652789/correct-usage-of-reduce-reducers/44371190#44371190) which goes into detail about the differences between combineReducers and reduceReducers.

## Creating a ReduxObject

The next step is to create an object model for the data you want to store. All driver pieces operate on the assumption that the objects being persisted/read extend the ReduxObject class included in the package.

```javascript
import { ReduxObject } from 'react-redux-driver';

class Friend extends ReduxObject {
  constructor(name) {
    super();
    this.name = name;
  }
}
```

The only requirement from the above code is that the class extends ReduxObject, how you instantiate or otherwise manipulate the objects is up to you. The driver will **ALWAYS** preserve the prototype when manipulating the state, so feel free to add non-primitive items to the class definitions.

## License

MIT
