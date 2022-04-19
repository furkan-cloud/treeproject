import React, { useState } from "react";
import RequestModal from "./RequestModal";
import RequestAlert from "./Alert";
import { useSelector, useDispatch } from "react-redux";
import { Alert } from "antd";

const Request = (props) => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState("");
  const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.id)
  );
  // const [number, setNumber] = useState(0);
  const { tree, selectedNode } = useSelector((state) => state);

  const handleAlert = (status) => {
    console.log("handle alert worked");
    if (status === "Insufficient points") {
      setShowAlert(() => (
        <Alert
          message="Error Text"
          description="Not Enough Points"
          type="error"
        />
      ));
    } else if (status === "request sent") {
      setShowAlert(() => (
        <Alert
          message="Success Text"
          description="Request sent"
          type="success"
        />
      ));
    } else if (status === "accepted") {
      setShowAlert(() => (
        <Alert
          message="Request accepted"
          description="Request sent"
          type="success"
        />
      ));
    } else if (status === "rejected") {
      setShowAlert(() => (
        <Alert
          message="Request rejected"
          // description="Request sent"
          type="error"
        />
      ));
    }
    setTimeout(() => {
      setShowAlert(() => "");
    }, 2000);
  };

  return (
    <div>
      {showAlert}
      <RequestAlert />
      <RequestModal id={cardItem.id} handleAlert={handleAlert} visible={props.visible} setVisible={props.setVisible} />
    </div>
  );
};

export default Request;
