# React Redux Driver

[![npm version](https://badge.fury.io/js/react-redux-driver.svg)](https://badge.fury.io/js/react-redux-driver)
[![build status](https://travis-ci.org/aeldarex/react-redux-driver.svg?branch=master)](https://travis-ci.org/aeldarex/react-redux-driver)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/aeldarex/react-redux-driver/blob/master/README.md)

A powerful set of reducer functions, dispatchable actions, and selector creators to simplify operations with react-redux.

Need to update a user's token in the redux store?

```javascript
updateSection(Auth, { token: /*new token*/ })
```

Or what about adding a new friend connection for my user?

```javascript
const friend = new Friend('Bob');
insertOne(friend);
```

Or getting all of my user's friends whose userId starts with 'B' so they can view them in a list?

```javascript
const friendSelector = findMany(Friend, { userId: x => x.startsWith('B') });
const friends = friendSelector(state);
```

The react-redux-driver gives you all of the above functionality and more out of the box, no custom reducers or action creators needed.

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

Once the reducer is in place we're ready to start using the driver's dispatch functions to manipulate the state. The dispatch functions can be split into two types, actions which interact with state _sections_ and actions which interact with collections of state _objects_.

## What is a state _section_?

A state _section_ is state which will be used to contain a single, unique set of values. The simplest example of a state section would be the area of state you use to store a user's token and other credentials.

To model a state section, the react-redux-driver supplies a ReduxSection class. Custom section classes can extend this base class to enable powerful functionality in combination with the driver's dispatch actions.

```javascript
import { ReduxSection } from 'react-redux-driver';

class AuthSection extends ReduxSection {
  static get stateSlice() {
    return 'auth';
  }

  static get defaultState() {
    return {
      userId: null,
      token: null
    };
  }
}
```

### Anatomy of a ReduxSection

ReduxSection classes currently have two properties which can be overidden as in the above example.

- stateSlice: Defines where in the overall state this section will be stored. Defaults to the class name if not specified.
- defaultState: Defines how this _section_ should look by default. This comes into play when resetting the state. Default to an empty object if not specified.

### Updating a state _section_

So we've got our cool AuthSection class, but just having the class doesn't do anything for us in terms of our redux state. To begin actually making changes to the state the driver provides the following two actions.

```typescript
updateSection(sectionDefinition: typeof ReduxSection, update: any);
resetSection(sectionDefinition: typeof ReduxSection);
```

Both actions update the section of state corresponding to the given ReduxSection, but they do so in a slightly different manner. The updateSection action allows for custom updates, applying the changes from the update object to the state. The resetSection action, on the other hand, 'resets' the state back to the defaultState described by the ReduxSection definition.

### Reading a state _section_

Reading the section of state defined by our AuthSection class follows similar guidelines.

```typescript
getSection(sectionDefinition: typeof ReduxSection);
```

This creates a selector which will read out the state associated to the given ReduxSection.

### How do I actually use these with react and react-redux?

Below is a small example component using these concepts in action.

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSection, updateSection, resetSection } from 'react-redux-driver';
import { Auth } from './models/sections'; // Same Auth ReduxSection as above

class MyComponent extends Component {
  updateToken = newToken => {
    updateSection(Auth, { token: newToken }); // Overwrites state.auth.token with the value of newToken
  };

  logout = () => {
    resetSection(Auth); // Resets state.auth to be { userId: null, token: null }
  };

  render() {
    const isAuthenticated = this.props.token != null;
    // render the component
  }
}

const authSelector = getSection(Auth);
const mapStateToProps = state => {
  const auth = authSelector(state); // selects state.auth
  return {
    token: auth.token
  };
};

const mapDispatchToProps = { updateSection, resetSection };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyComponent);
```

And that's it, no reducer code or action creators required!

## What is a state _object_?

So we just finished discussing state _sections_, but not everything we want to store in redux makes sense as a _section_. Sometimes we'll have objects we want to store a lot of, and this is where the state _object_ concept comes into play.

To model a state object, the react-redux-driver supplies a ReduxObject class. Custom object classes can extend this base class to enable a ton of powerful functionality, just like the ReduxSection class.

```javascript
import { ReduxObject } from 'react-redux-driver';

class Friend extends ReduxObject {
  constructor(userId, pending) {
    super();
    this.userId = userId;
    this.pending = pending;
  }

  static get stateSlice() {
    return 'friends';
  }
}
```

### Anatomy of a ReduxObject

ReduxObject classes currently have one property which can be overidden as in the above example.

- stateSlice: Defines where in the overall state these objects will be stored. Defaults to the class name plus the letter 's' if not specified.

### Updating a collection of state _objects_

So we've defined a Friend class and we want to add one or more of them to our state. To do so we can create some new Friend objects and insert them with the following methods.

```typescript
insertOne(object: ReduxObject);
insertMany(objects: Array<ReduxObject>);
```

Once these objects exist in our state we can update them.

```typescript
updateOne(objectType: typeof ReduxObject, filter: any, update: any);
updateMany(objectType: typeof ReduxObject, filter: any, update: any);
```

Or delete them.

```typescript
deleteOne(objectType: typeof ReduxObject, filter: any);
deleteMany(objectType: typeof ReduxObject, filter: any);
```

All the actions are pretty self-explanatory, but the filter object is something we haven't seen yet (as filtering really doesn't make sense in terms of _sections_). With state _objects_, we're storing a number of a given object in our state, so the filter object allows us to describe which of those object we want to apply the action to.

### Reading a collection of state _objects_

Reading the stored objects follows a similar pattern to reading from a state _section_, but once again we utilize a filter to specify specific items.

```typescript
findOne(objectType: typeof ReduxObject, filter: any);
findMany(objectType: typeof ReduxObject, filter: any);
```

Both methods create a selector which will search the section of state specified by the given ReduxObject class for anything matching the given filter. All objects matching the filter are returned.

### How do I actually use these with react and react-redux?

Below is a small example component using these concepts in action.

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findMany, insertOne, updateOne, deleteOne } from 'react-redux-driver';
import { Friend } from './models/objects'; // Same Friend ReduxObject as above

class MyComponent extends Component {
  addFriend = friendId => {
    const newFriend = new Friend(friendId, true);
    insertOne(newFriend); // Adds the newly created Friend to state.friends
  };

  acceptFriend = friendId => {
    updateOne(Friend, { userId: friendId }, { pending: false }); // Finds the friend with userId === friendId in state.friends and sets its pending prop to false
  };

  removeFriend = friendId => {
    deleteOne(Friend, { userId: friendId }); // Deletes the friend with userId === friendId in state.friends
  };

  render() {
    const { pendingFriends } = this.props;
    // render the component
  }
}

const pendingFriendsSelector = findMany(Friend, { pending: true });
const mapStateToProps = state => {
  const pendingFriends = pendingFriendsSelector(state); // selects all friends in state.friends which have pending as true
  return {
    pendingFriends
  };
};

const mapDispatchToProps = { insertOne, updateOne, deleteOne };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyComponent);
```

And as with state _sections_, no reducer code or action creators are required!

## Filters and Updates

So we've briefly discussed the ideas behind filter and update objects, but it's important to go into a little more detail describing how they work because a lot of the driver's power comes from their use.

### What is a filter object?

A filter object is used to describe which objects of a given type should be considered for an action. So let's say we store a bunch of the above Friend objects in our state with some new fields added: team and scoring. In our game we have a high score of 10,000 points and want to consider all the friends on team 'blue' who have better high scores. A filter to find those friends would be as follows.

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

## License

MIT
