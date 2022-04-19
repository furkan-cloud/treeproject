import { configureStore } from "@reduxjs/toolkit";
import { createStore } from "redux";
// import cardReducer from "./cardSlice.js";
import appReducer from "./reducers.js";

// export const store = configureStore({
//   reducer: { tree: cardReducer },
// });

export const store = createStore(appReducer);
