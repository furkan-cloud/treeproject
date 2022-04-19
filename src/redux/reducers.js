import update from "immutability-helper";

const initialState = {
  // card: {
  //   id: "n1",
  //   name: "Lao",
  //   self: 0,
  //   total: 0,
  //   requests: [],
  //   error: [],
  //   children: [],
  // },
  tree: [],
  requests: [],
  // selectedNode: [],
};

export default function appReducer(state = initialState, action) {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    // Do something here based on the different types of actions
    case "createCard": {
      console.log("acreaction", action);
      return {
        tree: [
          ...state.tree,
          {
            ...action.payload,
          },
        ],
      };
    }
    case "addCard": {
      let newState;
      if (state.tree.length > 1) {
        const index = state.tree.findIndex((item) => {
          if (item.parentId) {
            return item.id == action.payload.parentId;
          }
        });
        console.log("index", index);
        if (index > 0) {
          // const collection = [1, 2, {a: [12, 17, 15]}];
          // newState = update(state.tree[index].children, {
          //   $push: [action.payload.id],
          // });
          newState = update(state.tree, {
            [index]: { children: { $push: [action.payload.id] } },
          });
          console.log("newstate", newState);

          // state.tree[index].children.push(action.payload.id);
        } else {
          const index = state.tree.findIndex((item) => {
            return item.id == action.payload.parentId;
          });
          console.log("indexelse", index);
          newState = update(state.tree, {
            [index]: { children: { $push: [action.payload.id] } },
          });
        }
      } else {
        newState = update(state.tree, {
          0: { children: { $push: [action.payload.id] } },
        });
      }
      console.log("stater", newState);
      return {
        // ...state,
        // ...newState,
        tree: [...newState, action.payload],
      };
    }

    // ...state.tree,
    // state.tree[index]: {
    //   ...state.tree[index],
    //   state.tree[index].children: [
    //     ...state.tree[index].children, action.payload.id
    //   ]
    // }

    case "updateCard": {
      // We need to return a new state object
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
      // console.log(
      //   "calc",
      //   calculatePoint(state.tree, state.tree[index].parentId, change)
      // );
      return {
        // that has all the existing state data
        ...state,
        // and a new tree array with the new data
        tree: [
          ...calculatePoint(state.tree, state.tree[index].parentId, change),
        ],
      };
    }
    case "deleteCard": {
      // We need to return a new state object
      console.log("removeaction", action.payload);
      console.log("removestate", state);
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.parentId;
      });
      const childIndex = state?.tree[index]?.children?.findIndex((item) => {
        return item == action.payload.itemId;
      });
      console.log("index", index);
      console.log("childIndex", childIndex);
      const newChildList = update(state.tree, {
        [index]: { children: { $splice: [[childIndex, 1]] } },
      });
      state = {
        ...state,
        tree: [...newChildList],
      };
      console.log("sstebef", state);
      const childList = getAllChildren(state.tree, action.payload.itemId);
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
      const itemIndex = state.tree.findIndex((item) => {
        return item.id == action.payload.itemId;
      });
      const lastChildList = update(state.tree, {
        $splice: [[itemIndex, 1]],
      });
      return {
        ...state,
        tree: [...lastChildList],
      };
    }
    case "clearAll": {
      console.log("clearaction", action.payload);
      return {
        tree: [],
      };
    }
    case "requestPoint": {
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
      const liveRequestList = update(state.tree[index].liveRequests, {
        $push: [action.payload],
      });
      console.log("liveRequestList", liveRequestList);
      state = {
        ...state,
        tree: [
          ...state.tree.slice(0, index),
          {
            ...state.tree[index],
            liveRequests: [...liveRequestList],
          },
          ...state.tree.slice(index + 1),
        ],
      };
      console.log("laststate", state);
      // state.tree.find((item) => {
      //   if (item.id == action.payload.id) {
      //     if (item.self > action.payload.request) {
      //       item.self = item.self - action.payload.request;
      //       item.total = item.total - action.payload.request;
      //       calculatePoint(state.tree, item.parentId, -action.payload.request);
      //       calculatePoint(state.tree, item.parentId, -action.payload.request);
      //     } else {
      //     }
      //   }
      // });

      return {
        ...state,
      };
    }
    case "acceptRequest": {
      console.log("acceptRequest", action.payload);
      return {
        state,
      };
    }
    case "rejectRequest": {
      console.log("rejectRequest", action.payload);
      return {
        state,
      };
    }

    default:
      return state;
  }
}

function getAllChildren(beginNode, nodeId) {
  var allChildren = [];
  console.log("beginNode", beginNode);
  const index = beginNode.findIndex((item) => {
    return item.id == nodeId;
  });
  var allChildren = [...beginNode[index].children];
  console.log(allChildren);

  allChildren.forEach(function (childNode) {
    allChildren.push(...getAllChildren(beginNode, childNode));
  });

  return allChildren;
}

const removeItems = (array, itemsToRemove) => {
  console.log("array", array);
  console.log("itemsToRemove", itemsToRemove);
  return array.tree.filter((v) => {
    return !itemsToRemove.includes(v.id);
  });
};

function getAllParents(beginNode, nodeId, AllParents) {
  var AllParents = [];

  console.log("one", nodeId);
  const index = beginNode.findIndex((item) => {
    return item.id == nodeId;
  });
  if (beginNode[index].parentId) {
    // var AllParents = [...beginNode[index].parentId];
    AllParents.push(beginNode[index].parentId);
    console.log("all", AllParents);
    console.log("ids", beginNode[index].parentId);
  } else {
    return AllParents;
  }

  AllParents.forEach(function (child) {
    console.log("child", child);
    // AllParents.push(...[...getAllChildren(beginNode, child)]);
    getAllParents(beginNode, child);
  });
}

function postOrder(root) {
  if (root.children) {
    console.log("inside");
    root.total = 0;
    root.children.forEach((child) => {
      console.log("child", child);
      console.log("root", root);
      console.log("roottotal", root.total);
      root.total += postOrder(child);
    });
    root.total += root.self;
  } else {
    root.total = root.self;
  }
  return root.total;
}

function calculatePoint(treeList, parentId, change) {
  // const parentId = nodeList[nodeId].parentId;
  const index = treeList.findIndex((item) => {
    return item.id == parentId;
  });
  console.log("parentId", parentId);
  console.log("index", index);
  if (parentId) {
    treeList[index].total += change;
    console.log("worked");
    if (treeList[index].parentId) {
      console.log("d", treeList[index].parentId);
      calculatePoint(treeList, treeList[index].parentId, change);
    }
  }
  return treeList;
}
