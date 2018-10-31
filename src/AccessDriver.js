import createFindManySelector from './selectorCreation/createFindManySelector';

const AccessDriver = {
  find(objectType, filter) {
    return createFindManySelector(objectType, filter);
  },
};

export default AccessDriver;
