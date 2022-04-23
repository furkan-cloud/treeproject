import React, { useState } from "react";
import { Alert, Button, Space, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
const { TextArea } = Input;

const RequestAlert = (props) => {
  console.log("propsrequestalert", props);
  const dispatch = useDispatch();
  const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.id)
  );
  const [comment, setComment] = useState("");

  console.log("cardItemrequest", cardItem);

  console.log("props", props);
  const acceptRequest = () => {
    // props.setVisible(false);
    props.handleAlert("accepted");
    dispatch({
      type: "acceptRequest",
      payload: {
        id: props.id,
        receiverId: props.receiverId,
        // name: name,
        requestPoint: props.requestPoint,
        status: "successful",
      },
    });
  };

  const rejectRequest = () => {
    console.log("rejectrequestworked", props);
    // props.setVisible(false);
    props.handleAlert("rejected");
    dispatch({
      type: "rejectRequest",
      payload: {
        id: props.id,
        receiverId: props.receiverId,
        // name: name,
        requestPoint: props.requestPoint,
        status: "rejected",
      },
    });
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  return (
    <>
      {cardItem?.liveRequests?.length > 0 ? (
        <Alert
          message="Point Request"
          showIcon
          description={`Sender: ${cardItem?.liveRequests[0]?.name} | Amount: ${cardItem?.liveRequests[0]?.requestPoint}`}
          type="info"
          action={
            <Space direction="vertical" size="large" align="end">
              <TextArea rows={2} onChange={handleComment} size={"large"} />
              <Button size="small" type="primary" onClick={acceptRequest}>
                Accept
              </Button>
              <Button size="small" danger type="ghost" onClick={rejectRequest}>
                Decline
              </Button>
            </Space>
          }
          closable
        />
      ) : null}
    </>
  );
};

export default RequestAlert;
