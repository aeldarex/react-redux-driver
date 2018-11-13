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

The main takeaway is that it's important for the driverReducer to operate at the **top-level** of the state. If you are unfamiliar with the syntax above checkout out the [redux docs](https://redux.js.org/), the github for [reduce-reducers](https://github.com/redux-utilities/reduce-reducers), as well as this [stack overflow](https://stackoverflow.com/questions/38652789/correct-usage-of-reduce-reducers/44371190#44371190) which goes into detail about the differences between combineReducers and reduceReducers.

## Manipulating The State

Once the reducer is in place we're ready to start using the driver's dispatch functions to manipulate the state. But before we can start injecting our actions we need to discuss the concepts of _ReduxSection_, _ReduxObject_, _filter_, and _update_ objects.

## What is a ReduxSection

A ReduxSection is an object model for data you want to store in a top-level section of the state. You will usually want ReduxSection models for items like user specific configuration or a user's authentication data.

```javascript
import { ReduxSection } from 'react-redux-driver';

class Auth extends ReduxSection {
  constructor(userId, accessToken) {
    super();
    this.userId = userId;
    this.accessToken = accessToken;
  }
}
```

## What is a ReduxObject?

A ReduxObject is an object model for data which you want to store in multiple instances. You will usually want ReduxObject models for items like friends of a user, or a user's posts on a message board.

```javascript
import { ReduxObject } from 'react-redux-driver';

class Friend extends ReduxObject {
  constructor(name, team, scoring) {
    super();
    this.name = name;
    this.team = team;
    this.scoring = scoring;
  }
}
```

### What is a filter object?

A filter object is used to describe which objects of a given type should be considered for an action. So let's say we store a bunch of the above Friend objects in our state with their names, teams, and scoring. In our game we have a high score of 10,000 points and want to consider all the friends on team 'blue' who have better high scores. A filter to find those friends would be as follows.

```javascript
{
  team: 'blue',
  scoring: {
    highScore: x => x > 10000
  }
}
```

So let's break down each part of the above filter to describe what's happening.

- team: The team field has a string of 'blue' given, so the driver will look for all Friend objects which also have a team of 'blue'. The takeaway is that given a primitive (non-object, non-function, or null) the driver will consider the field using === equality.
- scoring: The scoring field is a complex object, so the driver will compare the properties of the object rather than comparing the object itself. There is no equality done at this level, but rather the object is broken down and compared.
- highScore: The highScore field is a function, so the driver will compare that field's value using the given function (so in this case, each Friend's highScore will be x and only highScores above 10000 will return true). If the function returns a truthy value given the property value then that object is considered as matching the filter on that property.

The driver can handle filters of any depth and filter functions can be of any complexity, but beware of creating long running operations with high complexity filters and large object sets.

### What is an update object?

An update object is used to describe how an object of a given type should be updated in the state. Coming back to our above example, let's say the server has notified us that one of our friends has achieved a new high score of 12,500. An update for this would look like the following.

```javascript
{
  scoring: {
    highScore: 12500,
    recentScores: x => x.push(12500)
  }
}
```

As with the filter object, let's break things down.

- scoring: As with filter, this is a complex object, so rather than do any operation on the property itself the driver will break down the complex object and consider the changes on its children.
- highScore: The highScore field has the number 12500 given, as this is a primitive (non-object and non-function), the state will update the friend's highScore property to be 12500.
- recentScores: The recentScores field has a function given, so the recentScores array will be passed into the function (in this case the Friend's recentScores will be x) and updated. This will result in the number 12500 being added to the recentScores array of the Friend.

As with filter, the update objects can be of any depth and update functions can be of any complexity, but the same warning regarding creation of long running operations applies here as well.

### What happens if my filter or update throws an error?

As javascript is not a typed language, there is no guarantee that all of our objects in the state will look the same, so sometimes a filter or update function may be run on an item it can't handle. The reducers account for this with the following logic.

- filter: If a filter throws an error then the object which caused the Error will be considered as failing the filter.
- update: If an update throws an error the object will not be updated and a warning will be published.

## Dispatch Actions

Equipped with the knowledge of how to create ReduxSection, ReduxObject, filter, and update objects, let's look at the dispatchable actions available to us as part of the driver.

### Create Actions

```typescript
insertOne(item: ReduxObject);
insertMany(items: Array<ReduxObject>);
```

The insert actions will insert one or more items into the state. If you attempt to insert an object twice, or set the id field manually and attempt to insert two objects with the same id, the second insert for the duplicated id will be ignored and a warning will be published.

### Update Actions

```typescript
updateOne(objectType: typeof ReduxObject, filter: any, update: any);
updateMany(objectType: typeof ReduxObject, filter: any, update: any);
updateSection(sectionName: ReduxSection, update: any);
```

The updateOne and updateMany actions will update one or more items currently existing in the state. The objectType describes the type of object to be updated, the filter outlines which objects of that type should be considered, and the update itself defines the changes which should be made to the items matching the filter. If updateOne is given a filter which matches more than one object then only the first object found will be updated (note that in terms of ordering the objects are tracked by id).

The updateSection action differs in that it's focused on updating a specific section of the state rather than doing a CRUD operation on given object(s). This is most useful when wanting to manage a state object where you will only ever want a single object. A good example of this would be storing a string token in an 'Auth' section of the state. You'll never want multiple auth objects, so instead of creating a ReduxObject with the token and using insertOne, you would create a ReduxSection with the token and use updateSection. This section could then be referenced with simply a 'state.Auth' in your mapStateToProps.

### Delete Actions

```typescript
deleteOne(objectType: typeof ReduxObject, filter: any);
deleteMany(objectType: typeof ReduxObject, filter: any);
```

The delete actions will delete one or more items currently existing in the state. The objectType describes the type of object to be deleted and then the filter outlines which object of that type should be considered. As with updateOne, if deleteOne is given a filter which matches more than one object then only the first is deleted (the note about object ordering applies here as well).

### Using the Actions

To use the actions, add them to your component's mapDispatchToProps.

```javascript
import { connect } from 'react-redux';
import { insertMany, deleteMany } from 'react-redux-driver';

// const MyComponent = ...

// const mapStateToProps = ...

const mapDispatchToProps = { updateSection, insertMany, deleteMany };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyComponent);
```

## Reading The State With Selectors

So now that the state can be modified, we will also want to read our modifications back into our components. This is achieved using filter objects in combination with two provided selector functions.

```typescript
findOne(objectType: typeof ReduxObject, filter: any);
findMany(objectType: typeof ReduxObject, filter: any);
```

The find functions create selectors for finding one or more items in the state. These use [reselect](https://github.com/reduxjs/reselect) under the hood, so they will never recompute unless the section of state for a given object type changes. Additionally, because they create plain selectors, the output can be composed into other, more complex, selectors as well.

To use them, simply add the selectors they create to your component's mapStateToProps.

```javascript
import { connect } from 'react-redux';
import { findMany } from 'react-redux-driver';
import { Friend } from './models';

// const MyComponent = ...

const blueFriendSelector = findMany(Friend, { team: 'blue' });
const mapStateToProps = state => {
  return {
    blueFriends: blueFriendSelector(state)
  };
};

// const mapDispatchToProps = ...

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyComponent);
```

## License

MIT
