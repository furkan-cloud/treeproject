import { createSlice, current } from "@reduxjs/toolkit";
const initialState = {
  // tree: {
  //   id: "n1",
  //   name: "Lao Lao",
  //   self: 0,
  //   total: 0,
  //   requests: [],
  //   error: [],
  //   children: [],
  // },
  tree: [],
};

export const cardSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    createCard: (state, action) => {
      // const item = state.tree.find(item => item.id == payload.action.id)

      // if(state.tree.length > 1) {
      //   const newState = {
      //     ...state,
      //     state.tree.action.payload
      //   }
      // }
      console.log("action", action);
      state.tree.push(action.payload);
    },
    deleteCard: (state, action) => {
      console.log("action", action);
      console.log("state", current(state));
      const index = state.tree.findIndex((item) => {
        return item.id == action.payload.parentId;
      });
      // delete item from parent list
      state.tree[index].children = state.tree[index].children.filter(
        (item) => item !== action.payload.id
      );

      console.log("state1", state);
      console.log("state2", current(state));
      // const currentState = current(state);
      const childList = getAllChildren(state.tree, action.payload.itemId);
      console.log("childlist", childList);
      // const parentList = getAllParents(state.tree, action.payload.itemId, []);
      // console.log("parentList", parentList);
      //delete all child items
      console.log("statebefremove", state.tree);
      const copyData = { ...state };
      console.log("copyData", copyData);
      const returnedData = removeItems(copyData, childList);
      console.log("newData", returnedData);
      // state.tree = newData.tree;
      console.log("stateafterremove", state);
      // delete item
      state.tree.splice(
        state.tree.findIndex((item) => item.id == action.payload.itemId),
        1
      );
      console.log("state", state);
    },
    clearAllData: (state, action) => {
      state.tree = [];
    },
    addCard: (state, action) => {
      // state.card.children.push(action.payload);

      if (state.tree.length > 1) {
        const index = state.tree.findIndex((item) => {
          if (item.parentId) {
            return item.id == action.payload.parentId;
          }
        });
        console.log("index", index);
        if (index > 0) {
          state.tree[index].children.push(action.payload.id);
        } else {
          state.tree[0].children.push(action.payload.id);
        }
      } else {
        state.tree[0].children.push(action.payload.id);
      }

      // const item = state.tree.find(item => item.parentId == payload.action.parentId)
      console.log("addaction", action);
      state.tree.push(action.payload);
      // state.tree.find(item => item.parentId == action.payload.parentId)
    },
    requestAmount: (state, action) => {
      state.value += action.payload;
    },
    requestAmountSuccess: (state, action) => {
      state.value += action.payload;
    },
    requestAmountFailed: (state, action) => {
      state.value += action.payload;
    },
    selectNode: (state, action) => {
      state.selectedNode += action.payload;
    },
  },
});

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
  console.log("array", current(array));
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

// Action creators are generated for each case reducer function
export const { createCard, addCard, deleteCard, clearAllData, selectNode } =
  cardSlice.actions;

export default cardSlice.reducer;
