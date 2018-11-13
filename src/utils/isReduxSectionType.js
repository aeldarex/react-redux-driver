import ReduxSection from '../ReduxSection';

function isReduxSectionType(sectionType) {
  return sectionType != null && sectionType.prototype instanceof ReduxSection;
}

export default isReduxSectionType;
