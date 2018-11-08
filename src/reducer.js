import createReducer from './utils/createReducer';
import {
  DRIVER_UPDATE_SECTION,
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_UPDATE_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from './actionTypes';
import {
  updateSectionHandler,
  insertOneHandler,
  insertManyHandler,
  updateOneHandler,
  updateManyHandler,
  deleteOneHandler,
  deleteManyHandler,
} from './reducerActionHandlers';

const handlers = {
  [DRIVER_UPDATE_SECTION]: updateSectionHandler,
  [DRIVER_INSERT_ONE]: insertOneHandler,
  [DRIVER_INSERT_MANY]: insertManyHandler,
  [DRIVER_UPDATE_ONE]: updateOneHandler,
  [DRIVER_UPDATE_MANY]: updateManyHandler,
  [DRIVER_DELETE_ONE]: deleteOneHandler,
  [DRIVER_DELETE_MANY]: deleteManyHandler,
};

export default createReducer({}, handlers);
