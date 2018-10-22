import ReduxObject from '../ReduxObject';

function isReduxObjectType(objectType) {
  return objectType != null && objectType.prototype instanceof ReduxObject;
}

export default isReduxObjectType;
