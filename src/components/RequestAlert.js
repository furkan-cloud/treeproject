import React, { useState } from "react";
import { Alert, Button, Space, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { acceptRequest, rejectRequest } from "../redux/actions/tree";

const { TextArea } = Input;
const RequestAlert = (props) => {
  const dispatch = useDispatch();
  const { tree } = useSelector((state) => state);
  const [alertId, setAlertId] = useState(0);
  const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.id)
  );
  const [comment, setComment] = useState("");

  const handleAcceptRequest = () => {
    props.handleAlert("accepted");

    const index = tree.findIndex((item) => {
      return item.id == props.id;
    });
    const requestIndex = tree.findIndex((item) => {
      return item.id == tree[index]?.liveRequests[0].id;
    });
    setAlertId([tree[requestIndex]?.id, "accepted"]);

    dispatch(
      acceptRequest({
        id: props.id,
        status: "successful",
      })
    );
  };

  const handleRejectRequest = () => {
    props.handleAlert("rejected");

    dispatch(
      rejectRequest({
        id: props.id,
        status: "rejected",
      })
    );
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
          description={`Sender: ${cardItem?.liveRequests[0]?.name} \n Amount: ${cardItem?.liveRequests[0]?.requestPoint}`}
          type="info"
          action={
            <Space direction="vertical" size="middle" align="end">
              <TextArea rows={2} onChange={handleComment} size={"large"} />
              <Button size="small" type="primary" onClick={handleAcceptRequest}>
                Accept
              </Button>
              <Button
                size="small"
                danger
                type="ghost"
                onClick={handleRejectRequest}
              >
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
