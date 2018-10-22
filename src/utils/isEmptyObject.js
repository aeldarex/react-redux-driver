function isEmptyObject(object) {
  return Object.getOwnPropertyNames(object).length === 0;
}

export default isEmptyObject;
