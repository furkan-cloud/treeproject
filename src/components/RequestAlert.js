import React, { useState } from "react";
import { Alert, Button, Space, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { acceptRequest, rejectRequest } from "../redux/actions/tree";

const { TextArea } = Input;
const RequestAlert = (props) => {
  console.log("propsrequestalert", props);
  const dispatch = useDispatch();
  const { tree } = useSelector((state) => state);
  const [alertId, setAlertId] = useState(0);
  const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.id)
  );
  const [comment, setComment] = useState("");

  console.log("cardItemrequest", cardItem);

  // useEffect(() => {
  //   console.log("useeeeee", cardItem, alertId);
  //   if (cardItem.id == alertId[0] && alertId[1] == "rejected") {
  //     console.log("userejected");
  //     props.handleAlert("rejected");
  //   } else if (cardItem.id == alertId[0] && alertId[1] == "accepted") {
  //     console.log("useaccepted");
  //     props.handleAlert("accepted");
  //   }
  // }, [tree, alertId, cardItem]);

  console.log("props", props);
  const handleAcceptRequest = () => {
    // props.setVisible(false);
    props.handleAlert("accepted");

    const index = tree.findIndex((item) => {
      return item.id == props.id;
    });
    console.log("rejectindexxxx", index);
    const requestIndex = tree.findIndex((item) => {
      return item.id == tree[index]?.liveRequests[0].id;
    });
    setAlertId([tree[requestIndex]?.id, "accepted"]);

    dispatch(
      acceptRequest({
        id: props.id,
        // receiverId: props.receiverId,
        // name: name,
        // requestPoint: props.requestPoint,
        status: "successful",
      })
    );
  };

  const handleRejectRequest = () => {
    console.log("rejectrequestworked", props);
    // props.setVisible(false);
    props.handleAlert("rejected");

    // const index = tree.findIndex((item) => {
    //   return item.id == props.id;
    // });
    // console.log("rejectindexxxx", index);
    // const requestIndex = tree.findIndex((item) => {
    //   return item.id == tree[index]?.liveRequests[0].id;
    // });
    // setAlertId([tree[requestIndex]?.id, "rejected"]);
    dispatch(
      rejectRequest({
        id: props.id,
        // receiverId: props.receiverId,
        // name: name,
        // requestPoint: props.requestPoint,
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
          description={`Sender: ${cardItem?.liveRequests[0]?.name} | Amount: ${cardItem?.liveRequests[0]?.requestPoint}`}
          type="info"
          action={
            <Space direction="vertical" size="large" align="end">
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
