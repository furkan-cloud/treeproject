const initialState = {
    card: {
      id: "n",
      name: "Lao",
      self: 0,
      total: 0,
      requests: [],
      error: [],
      children: [],
    },
    // selectedNode: [],
  };
  
  export default function appReducer(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
      // Do something here based on the different types of actions
      case "createCard": {
        console.log("acreaction", action);
      }
      case "addCard": {
        // We need to return a new state object
        console.log("addaction", action);
        return {
          // that has all the existing state data
          ...state,
        };
      }
  
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state;
    }
  }
  