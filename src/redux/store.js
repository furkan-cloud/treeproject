import { createStore } from "redux";
import appReducer from "./reducers.js";

export const store = createStore(appReducer);
