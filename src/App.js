import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Card from "./components/Card";
// import {
//   createCard,
//   addCard,
//   deleteCard,
//   clearAllData,
//   selectNode,
// } from "./redux/cardSlice";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TreeList from "./components/CardList";

function App() {
  const { tree } = useSelector((state) => state);

  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.getItem("cardTree", JSON.stringify(tree));
    console.log("localgetitemworked");
  }, []);

  const handleAdd = () => {
    const data = {
      id: uuidv4(),
      name: "",
      self: 0,
      total: 0,
      requests: [],
      error: [],
      children: [],
    };
    console.log("createcarddata", data);
    // dispatch(createCard(data));
    dispatch({
      type: "createCard",
      payload: data,
    });
    console.log("addworked");
  };
  console.log("cardapp", tree);

  const handleSave = () => {
    localStorage.setItem("localsetitemworked", JSON.stringify(tree));
  };

  const handleClear = () => {
    // dispatch(clearAllData());
    dispatch({
      type: "clearAll",
    });
    console.log("handleClear");
  };

  return (
    <div className="section">
      <div className="section-btns">
        <Button type="primary" onClick={handleSave}>
          SAVE
        </Button>
        <Button onClick={handleAdd}>ADD</Button>
        <Button onClick={handleClear}>CLEAR ALL</Button>
      </div>
      <div className="section-cards">
        {tree ? <TreeList /> : <h1>There is no data</h1>}
      </div>
    </div>
  );
}

export default App;
