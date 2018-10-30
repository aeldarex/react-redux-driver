import createReducer from './utils/createReducer';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from './actionTypes';
import {
  insertOneHandler,
  insertManyHandler,
  updateOneHandler,
  deleteOneHandler,
  deleteManyHandler,
} from './reducerActionHandlers';

const handlers = {
  [DRIVER_INSERT_ONE]: insertOneHandler,
  [DRIVER_INSERT_MANY]: insertManyHandler,
  [DRIVER_UPDATE_ONE]: updateOneHandler,
  [DRIVER_DELETE_ONE]: deleteOneHandler,
  [DRIVER_DELETE_MANY]: deleteManyHandler,
};

export default createReducer({}, handlers);
