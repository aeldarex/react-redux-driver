function isObjectWithOwnProps(object) {
  return (
    object != null
    && typeof object === 'object'
    && Object.getOwnPropertyNames(object).length > 0
  );
}

export default isObjectWithOwnProps;
