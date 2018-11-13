function isObjectWithId(object) {
  return object != null && typeof object === 'object' && object.id != null;
}

export default isObjectWithId;
