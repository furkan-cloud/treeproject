import React, { useState } from "react";
import RequestModal from "./RequestModal";
import RequestAlert from "./RequestAlert";
import { useSelector, useDispatch } from "react-redux";
import { Alert } from "antd";

const Request = (props) => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState("");
  const { tree, selectedNode } = useSelector((state) => state);
  const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.id)
  );

  const handleAlert = (status) => {
    if (status === "Insufficient points") {
      setShowAlert(() => (
        <Alert
          description="Not Enough Points"
          type="error"
        />
      ));
    } else if (status === "request sent") {
      setShowAlert(() => (
        <Alert
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
      <RequestAlert id={cardItem.id} handleAlert={handleAlert} />
      <RequestModal
        id={cardItem.id}
        name={cardItem.name}
        handleAlert={handleAlert}
        visible={props.visible}
        setVisible={props.setVisible}
      />
    </div>
  );
};

export default Request;
