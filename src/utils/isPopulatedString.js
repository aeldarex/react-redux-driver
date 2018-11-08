function isPopulatedString(object) {
  return object != null && typeof object === 'string' && object.length > 0;
}

export default isPopulatedString;
