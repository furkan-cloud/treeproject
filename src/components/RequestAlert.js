import React, {useState} from 'react'
import { Alert, Button, Space,Input } from 'antd';
const { TextArea } = Input;
import { useSelector, useDispatch } from "react-redux";

const RequestAlert = (props) => {
    const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.itemId)
  );
  const [comment, setComment] = useState("")

    console.log("props", props);
    const acceptRequest = () => {
        props.setVisible(false);
        props.handleAlert("accepted")
        props.dispatch({
            type: "requestPoint",
            payload: {
                id: props.id,
                receiverId: props.receiverId,
                // name: name,
                requestPoint: props.requestPoint,
                status: "successful",
            },
        });
    }

    const rejectRequest = () => {
        props.setVisible(false);
        props.handleAlert("rejected")
        props.dispatch({
            type: "requestPoint",
            payload: {
                id: props.id,
                receiverId: props.receiverId,
                // name: name,
                requestPoint: props.requestPoint,
                status: "rejected",
            },
        });

        const handleComment = (e) => {
setComment(e.target.value)
        }
 
  return (
    <Alert
      message="Point Request"
      showIcon
      description={`Sender: ${props.sender} | Amount: ${props.amount}`}
      type="info"
      action={
        <Space direction="vertical">
            <TextArea rows={4} onChange={handleComment}/>
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
  )
}

export default RequestAlert