import React, { useEffect } from "react";
import { Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import { createCard, clearAll, getSavedData } from "../redux/actions/tree";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    const savedData = window.localStorage.getItem(
      "cardTree",
      JSON.stringify(state)
    );
    dispatch(getSavedData(savedData ? JSON.parse(savedData) : { tree: [] }));
  }, []);

  const handleAdd = () => {
    const data = {
      id: uuidv4(),
      name: "",
      self: 0,
      total: 0,
      requests: [],
      liveRequests: [],
      children: [],
    };
    dispatch(
      createCard({
        data,
      })
    );
  };
  const handleSave = () => {
    window.localStorage.setItem("cardTree", JSON.stringify(state));
  };

  const handleClear = () => {
    window.localStorage.setItem("cardTree", JSON.stringify({ tree: [] }));
    dispatch(clearAll());
  };

  return (
    <div className="section-btns">
      <Button type="primary" onClick={handleSave}>
        SAVE
      </Button>
      <Button onClick={handleAdd}>ADD</Button>
      <Button onClick={handleClear}>CLEAR ALL</Button>
    </div>
  );
};

export default Header;
