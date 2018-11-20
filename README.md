# React Redux Driver

[![npm version](https://badge.fury.io/js/react-redux-driver.svg)](https://badge.fury.io/js/react-redux-driver)
[![build status](https://travis-ci.org/aeldarex/react-redux-driver.svg?branch=master)](https://travis-ci.org/aeldarex/react-redux-driver)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/aeldarex/react-redux-driver/blob/master/README.md)

A powerful set of reducer functions, dispatchable actions, and selector creators to simplify operations with react-redux. The end goal of the driver is to remove the need to write code for the majority of basic state operations. It accomplishes this by treating the redux state similar to a database, allowing you to write custom queries against your state while handling the immutability of redux for you.

## Installation

```
npm install --save react-redux-driver
```

## Adding the reducer

First step is to add the driver reducer to your root reducer. The driver reducer will provide basic handling of all actions created by the included action creators. If you're starting a brand new app and don't have any existing reducers, your root reducer can just be the driver reducer.

```javascript
import { driverReducer } from 'react-redux-driver';

const rootReducer = driverReducer;

export default rootReducer;
```

If you want to integrate the reducer alongside already existing reducers, that can easily be accomplished using combineReducers and reducerReducers.

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

**NOTE:** The following documentation will refer to filter and update objects without going into much detail on how they should look. A more detailed breakdown of these objects exists at the end of the readme, so if you're feeling lost feel free to read further down to get a full understanding of how the driver interprets these objects.

## What is a state _section_?

A state _section_ is state which will be used to contain a single, unique set of values. The simplest example of a state section would be the area of state you use to store a user's token and other credentials. Interaction with state sections is pretty open-ended, so modifying these sections is done through a single update action creator.

```typescript
updateSection(sectionName: string, update: Object);
```

In a similar fashion, reading data from these sections is done through use of a single selector creator.

```typescript
getSection(sectionName: string);
```

### How do I incorporate these into my react app?

Below is a small example component using these concepts in action. It is important to note that the above functions consist of an action creator and a selector creator, so they don't do anything unless used with mapStateToProps and mapDispatchToProps like below.

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSection, updateSection } from 'react-redux-driver';
import { AUTH } from './store/sectionNames'; // let's say this is the string 'AUTH'

class MyComponent extends Component {
  updateToken = newToken => {
    updateSection(AUTH, { token: newToken }); // Overwrites state.AUTH.token with the value of newToken
  };

  logout = () => {
    updateSection(AUTH, { token: null }); // Resets state.AUTH to be { token: null }
  };

  render() {
    const { isAuthenticated } = this.props;
    // render the component
  }
}

const authSelector = getSection(AUTH);
const mapStateToProps = state => {
  const auth = authSelector(state); // selects state.AUTH
  return {
    isAuthenticated: auth.token != null
  };
};

const mapDispatchToProps = { updateSection };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyComponent);
```

## What is a state _object_?

So state _sections_ are useful, and it's often what beginner tutorials for redux focus on, but sometimes we will want to store multiple copies of data and in this case _sections_ become very cumbersome. Best case, we handle this by having sections of state with arrays of objects in them, but sifting through these arrays can quickly become quite annoying to manage, especially if we have a lot of them. The concept of a state _object_ is meant to answer this issue by offering a wide selection of actions specifically suited to object management.

```typescript
// Inserting objects
insertOne(sectionName: string, object: Object);
insertMany(sectionName: string, objects: Array<Object>);

// Updating objects
updateOne(sectionName: string, filter: Object, update: Object);
updateMany(sectionName: string, filter: Object, update: Object);

// Delete objects
deleteOne(sectionName: string, filter: Object);
deleteMany(sectionName: string, filter: Object);
```

What each of the actions do is pretty self-explanatory, but the filter object is something we haven't seen yet (as filtering really doesn't make sense in terms of _sections_). With state _objects_, we have many copies of a given object in our state, so the filter object allows us to describe which of those object we want to apply the action to. Thus, the driver takes care of doing all the "collection manipulation" required to pull off an action, all we do is outline the insertion, update, or deletion we want to occur.

Reading these objects back out of the state follows a similar pattern.

```typescript
findOne(sectionName: string, filter: Object);
findMany(sectionName: string, filter: Object);
```

### How do I incorporate these into my react app?

Below is a small example component using these concepts in action. It is important to note that the above functions consist of action creators and selector creators, so they don't do anything unless used with mapStateToProps and mapDispatchToProps like below.

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findMany, insertOne, updateOne, deleteOne } from 'react-redux-driver';
import { FRIENDS } from './store/collectionNames'; // let's say this is the string 'FRIENDS'

class MyComponent extends Component {
  addFriend = friendId => {
    insertOne(FRIENDS, { userId: friendId, pending: true }); // Adds the new friend object to state.FRIENDS
  };

  acceptFriend = friendId => {
    updateOne(FRIENDS, { userId: friendId }, { pending: false }); // Finds the friend with userId === friendId in state.FRIENDS and sets its pending prop to false
  };

  removeFriend = friendId => {
    deleteOne(FRIENDS, { userId: friendId }); // Deletes the friend with userId === friendId in state.FRIENDS
  };

  render() {
    const { pendingFriends } = this.props;
    // render the component
  }
}

const pendingFriendsSelector = findMany(FRIENDS, { pending: true });
const mapStateToProps = state => {
  const pendingFriends = pendingFriendsSelector(state); // selects all friends in state.FRIENDS which have pending as true
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

## Filters and Updates

So we've briefly discussed the ideas behind filter and update objects, but it's important to go into a little more detail describing how they work because a lot of the driver's power comes from their use.

### What is a filter object?

A filter object is used to describe which objects of a given type should be considered for an action. So let's say we store a bunch of the above friend objects in our state with some new fields added: team and scoring. In our game we have a high score of 10,000 points and want to consider all the friends on team 'blue' who have better high scores. A filter to find those friends would be as follows.

```javascript
{
  team: 'blue',
  scoring: {
    highScore: x => x > 10000
  }
}
```

So let's break down each part of the above filter to describe what's happening.

- team: The team field has a string of 'blue' given, so the driver will look for all friend objects which also have a team of 'blue'. The takeaway is that given a primitive (non-object, non-function, or null) the driver will consider the field using === equality.
- scoring: The scoring field is a complex object, so the driver will compare the properties of the object rather than comparing the object itself. There is no equality done at this level, but rather the object is broken down and compared.
- highScore: The highScore field is a function, so the driver will compare that field's value using the given function (so in this case, each friend's highScore will be x and only highScores above 10000 will return true). If the function returns a truthy value given the property value then that object is considered as matching the filter on that property.

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
