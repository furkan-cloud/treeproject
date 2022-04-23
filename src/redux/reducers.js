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
      console.log("geteaction", action);
      return {
        ...state,
        tree: [...action.payload.tree],
      };
    }

    case CREATE_CARD: {
      console.log("acreaction", action);
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
        console.log("index", index);
        if (index > 0) {
          newState = update(state.tree, {
            [index]: { children: { $push: [action.payload.data.id] } },
          });
          console.log("newstate", newState);
        } else {
          const index = state.tree.findIndex((item) => {
            return item.id == action.payload.data.parentId;
          });
          console.log("indexelse", index);
          newState = update(state.tree, {
            [index]: { children: { $push: [action.payload.data.id] } },
          });
        }
      } else {
        newState = update(state.tree, {
          0: { children: { $push: [action.payload.data.id] } },
        });
      }
      console.log("stater", newState);
      return {
        tree: [...newState, action.payload.data],
      };
    }

    case UPDATE_CARD: {
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.id;
      });
      const change = action.payload.self - state.tree[index].self;
      console.log("change", change);
      console.log("updateaction", index);
      console.log("updateaction", action);
      const newData = update(state.tree[index], {
        $merge: {
          id: action.payload.id,
          name: action.payload.name,
          self: action.payload.self,
          total: action.payload.total + change,
        },
      });
      console.log("newData", newData);
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, index),
          newData,
          ...state.tree.slice(index + 1),
        ],
      };
      console.log("state", state);
      return {
        ...state,
        tree: [
          ...calculatePoint(state.tree, state.tree[index].parentId, change),
        ],
      };
    }
    case DELETE_CARD: {
      console.log("removeaction", action.payload);
      console.log("removestate", state);
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

      console.log("index", index);
      console.log("childIndex", childIndex);
      if (index > -1 && childIndex > -1) {
        const newChildList = update(state.tree, {
          [index]: { children: { $splice: [[childIndex, 1]] } },
        });
        state = {
          ...state,
          tree: [...newChildList],
        };
      }
      console.log("sstebef", state);
      const childList = getAllChildren(state.tree, action.payload.props.itemId);
      console.log("childlist", childList);
      const copyData = { ...state };
      console.log("copyData", copyData);
      const returnedData = removeItems(copyData, childList);
      console.log("newData", returnedData);
      state = {
        ...state,
        tree: [...returnedData],
      };
      console.log("laststate", state);
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
      console.log("clearaction", action.payload);
      return {
        tree: [],
      };
    }
    case REQUEST_POINT: {
      console.log("clearaction", action.payload);
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.id;
      });
      console.log("requestindex", index);
      const updatedRequestList = update(state.tree[index].requests, {
        $push: [action.payload],
      });
      console.log("updatedRequestList", updatedRequestList);
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
      console.log("state", state);
      if (action.payload.status == "rejected") {
        console.log("rejected return");
        return { ...state };
      }
      console.log("devam");
      const receiverIndex = state.tree.findIndex((item) => {
        return item.id == action.payload.receiverId;
      });
      console.log("receiverIndex", receiverIndex);
      const liveRequestList = update(state.tree[receiverIndex].liveRequests, {
        $push: [action.payload],
      });
      console.log("liveRequestList", liveRequestList);
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
      console.log("laststate", state);

      return {
        ...state,
      };
    }
    case ACCEPT_REQUEST: {
      console.log("acceptRequest", action.payload);
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.id;
      });
      console.log("index", index);
      const requestIndex = state.tree.findIndex((item) => {
        return item.id == state?.tree[index]?.liveRequests[0].id;
      });
      console.log("requestindex", requestIndex);
      const updatedRequestList = update(
        state.tree[requestIndex].requests[
          state.tree[requestIndex].requests.length - 1
        ].status,
        {
          $set: "rejected",
        }
      );
      console.log("updatedRequestList", updatedRequestList);
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
      console.log("state", state);
      const requestedPoint = state.tree[index].liveRequests[0].requestPoint;

      const updatedLiveRequestList = update(state.tree[index].liveRequests, {
        $set: [],
      });
      console.log("updatedLiveRequestList", updatedLiveRequestList);
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
      console.log("statelast", state);
      console.log("index", index);
      console.log("change", requestedPoint);

      const newData = update(state.tree[requestIndex], {
        $merge: {
          self: state.tree[requestIndex].self + requestedPoint,
          total: state.tree[requestIndex].total + requestedPoint,
        },
      });
      console.log("newData", newData);
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, requestIndex),
          newData,
          ...state.tree.slice(requestIndex + 1),
        ],
      };
      console.log("state", state);
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
      console.log("newGivenData", newGivenData);
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, index),
          newGivenData,
          ...state.tree.slice(index + 1),
        ],
      };
      console.log("state", state);

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
      console.log("rejectRequest", action.payload);
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.id;
      });
      console.log("index", index);
      const requestIndex = state.tree.findIndex((item) => {
        return item.id == state?.tree[index]?.liveRequests[0].id;
      });
      console.log("requestindex", requestIndex);
      const updatedRequestList = update(
        state.tree[requestIndex].requests[
          state.tree[requestIndex].requests.length - 1
        ].status,
        {
          $set: "rejected",
        }
      );
      console.log("updatedRequestList", updatedRequestList);
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
      console.log("state", state);

      const updatedLiveRequestList = update(state.tree[index].liveRequests, {
        $set: [],
      });
      console.log("updatedLiveRequestList", updatedLiveRequestList);
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
      console.log("statelast", state);
      console.log("index", index);

      return {
        ...state,
      };
    }

    default:
      return state;
  }
}
