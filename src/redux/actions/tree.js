import * as types from "../types";

export const createCard = (payload) => ({
  type: types.CREATE_CARD,
  payload,
});

export const addCard = (payload) => ({
  type: types.ADD_CARD,
  payload,
});

export const updateCard = (payload) => ({
  type: types.UPDATE_CARD,
  payload,
});

export const deleteCard = (payload) => ({
  type: types.DELETE_CARD,
  payload,
});

export const clearAll = (payload) => ({
  type: types.CLEAR_ALL,
  payload,
});

export const requestPoint = (payload) => ({
  type: types.REQUEST_POINT,
  payload,
});

export const acceptRequest = (payload) => ({
  type: types.ACCEPT_REQUEST,
  payload,
});

export const rejectRequest = (payload) => ({
  type: types.REJECT_REQUEST,
  payload,
});
