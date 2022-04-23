import update from "immutability-helper";
import {
  CREATE_CARD,
  ADD_CARD,
  UPDATE_CARD,
  DELETE_CARD,
  CLEAR_ALL,
  REQUEST_POINT,
  ACCEPT_REQUEST,
  REJECT_REQUEST,
  GET_SAVED_DATA,
} from "./types";
import {
  calculatePoint,
  removeItems,
  getAllChildren,
} from "../utils/reducerHelpers";

const initialState = {
  tree: [],
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SAVED_DATA: {
      return {
        ...state,
        tree: [...action.payload.tree],
      };
    }

    case CREATE_CARD: {
      return {
        tree: [
          ...state.tree,
          {
            ...action.payload.data,
          },
        ],
      };
    }
    case ADD_CARD: {
      let newState;
      if (state.tree.length > 1) {
        const index = state.tree.findIndex((item) => {
          if (item.parentId) {
            return item.id == action.payload.data.parentId;
          }
        });
        if (index > 0) {
          newState = update(state.tree, {
            [index]: { children: { $push: [action.payload.data.id] } },
          });
        } else {
          const index = state.tree.findIndex((item) => {
            return item.id == action.payload.data.parentId;
          });
          newState = update(state.tree, {
            [index]: { children: { $push: [action.payload.data.id] } },
          });
        }
      } else {
        newState = update(state.tree, {
          0: { children: { $push: [action.payload.data.id] } },
        });
      }
      return {
        tree: [...newState, action.payload.data],
      };
    }

    case UPDATE_CARD: {
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.id;
      });
      const change = action.payload.self - state.tree[index].self;
      const newData = update(state.tree[index], {
        $merge: {
          id: action.payload.id,
          name: action.payload.name,
          self: action.payload.self,
          total: action.payload.total + change,
        },
      });
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, index),
          newData,
          ...state.tree.slice(index + 1),
        ],
      };
      return {
        ...state,
        tree: [
          ...calculatePoint(state.tree, state.tree[index].parentId, change),
        ],
      };
    }
    case DELETE_CARD: {
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.props.parentId;
      });
      const childIndex = state?.tree[index]?.children?.findIndex((item) => {
        return item == action.payload.props.itemId;
      });
      const itemIndex = state.tree.findIndex((item) => {
        return item.id == action.payload.props.itemId;
      });

      state = {
        ...state,
        tree: [
          ...calculatePoint(
            state.tree,
            state.tree[itemIndex].parentId,
            -state.tree[itemIndex].total
          ),
        ],
      };

      if (index > -1 && childIndex > -1) {
        const newChildList = update(state.tree, {
          [index]: { children: { $splice: [[childIndex, 1]] } },
        });
        state = {
          ...state,
          tree: [...newChildList],
        };
      }
      const childList = getAllChildren(state.tree, action.payload.props.itemId);
      const copyData = { ...state };
      const returnedData = removeItems(copyData, childList);
      state = {
        ...state,
        tree: [...returnedData],
      };
      // delete item
      const updatedList = update(state.tree, {
        $splice: [[itemIndex, 1]],
      });

      return {
        ...state,
        tree: [...updatedList],
      };
    }
    case CLEAR_ALL: {
      return {
        tree: [],
      };
    }
    case REQUEST_POINT: {
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.id;
      });
      const updatedRequestList = update(state.tree[index].requests, {
        $push: [action.payload],
      });
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, index),
          {
            ...state.tree[index],
            requests: [...updatedRequestList],
          },
          ...state.tree.slice(index + 1),
        ],
      };
      if (action.payload.status == "rejected") {
        return { ...state };
      }
      const receiverIndex = state.tree.findIndex((item) => {
        return item.id == action.payload.receiverId;
      });
      const liveRequestList = update(state.tree[receiverIndex].liveRequests, {
        $push: [action.payload],
      });
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, receiverIndex),
          {
            ...state.tree[receiverIndex],
            liveRequests: [...liveRequestList],
          },
          ...state.tree.slice(receiverIndex + 1),
        ],
      };

      return {
        ...state,
      };
    }
    case ACCEPT_REQUEST: {
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.id;
      });
      const requestIndex = state.tree.findIndex((item) => {
        return item.id == state?.tree[index]?.liveRequests[0].id;
      });
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, requestIndex),
          {
            ...state.tree[requestIndex],
            requests: [
              ...state.tree[requestIndex].requests.slice(
                0,
                state.tree[requestIndex].requests.length - 1
              ),
              {
                ...state.tree[requestIndex].requests[
                  state.tree[requestIndex].requests.length - 1
                ],
                status: "rejected",
              },
            ],
          },
          ...state.tree.slice(requestIndex + 1),
        ],
      };
      const requestedPoint = state.tree[index].liveRequests[0].requestPoint;

      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, index),
          {
            ...state.tree[index],
            liveRequests: [],
          },
          ...state.tree.slice(index + 1),
        ],
      };

      const newData = update(state.tree[requestIndex], {
        $merge: {
          self: state.tree[requestIndex].self + requestedPoint,
          total: state.tree[requestIndex].total + requestedPoint,
        },
      });
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, requestIndex),
          newData,
          ...state.tree.slice(requestIndex + 1),
        ],
      };
      state = {
        ...state,
        tree: [
          ...calculatePoint(
            state.tree,
            state.tree[requestIndex].parentId,
            requestedPoint
          ),
        ],
      };

      const newGivenData = update(state.tree[index], {
        $merge: {
          self: state.tree[index].self - requestedPoint,
          total: state.tree[index].total - requestedPoint,
        },
      });
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, index),
          newGivenData,
          ...state.tree.slice(index + 1),
        ],
      };

      return {
        ...state,
        tree: [
          ...calculatePoint(
            state.tree,
            state.tree[index].parentId,
            -requestedPoint
          ),
        ],
      };
    }
    case REJECT_REQUEST: {
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.id;
      });
      const requestIndex = state.tree.findIndex((item) => {
        return item.id == state?.tree[index]?.liveRequests[0].id;
      });
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, requestIndex),
          {
            ...state.tree[requestIndex],
            requests: [
              ...state.tree[requestIndex].requests.slice(
                0,
                state.tree[requestIndex].requests.length - 1
              ),
              {
                ...state.tree[requestIndex].requests[
                  state.tree[requestIndex].requests.length - 1
                ],
                status: "rejected",
              },
            ],
          },
          ...state.tree.slice(requestIndex + 1),
        ],
      };

      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, index),
          {
            ...state.tree[index],
            liveRequests: [],
          },
          ...state.tree.slice(index + 1),
        ],
      };

      return {
        ...state,
      };
    }

    default:
      return state;
  }
}
