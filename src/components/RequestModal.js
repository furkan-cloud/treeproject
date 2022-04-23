import { Modal, Button, Select, Form, InputNumber } from "antd";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const { Option } = Select;
const RequestModal = (props) => {
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const { tree, selectedNode } = useSelector((state) => state);
  const dispatch = useDispatch();

  const showModal = () => {
    setVisible(true);
  };

  function handleChange(value) {
    const cardItem = tree.find((item) => item.name === value);
    console.log("handleditem", cardItem);
    console.log(`selected ${value}`);
    setName(cardItem);
  }

  console.log("props", props);
  console.log("name", name);

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);

    const index = tree.findIndex((item) => {
      return item.id == props.id;
    });
    console.log("index", index);
    if (name.self > quantity) {
      props.setVisible(false);
      props.handleAlert("request sent");
      console.log("bigrequest");
      setConfirmLoading(false);
      dispatch({
        type: "requestPoint",
        payload: {
          id: props.id,
          receiverId: name.id,
          name: props.name,
          requestPoint: quantity,
          status: "pending",
        },
      });
    } else {
      props.setVisible(false);
      props.handleAlert("Insufficient points");
      console.log("smallrequest");
      setConfirmLoading(false);
      dispatch({
        type: "requestPoint",
        payload: {
          id: props.id,
          receiverId: name.id,
          name: props.name,
          requestPoint: quantity,
          status: "rejected",
        },
      });
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    props.setVisible(false);
  };

  return (
    <>
      <Modal
        title="Title"
        visible={props.visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Select
          // defaultValue="lucy"
          style={{ width: 120 }}
          onChange={handleChange}
        >
          {tree
            .filter((item) => item.id !== props.id)
            .map((item) => {
              return <Option value={item.name}>{item.name}</Option>;
            })}
        </Select>
        <Form.Item
          label="request amount"
          name="number"
          className="cart__form__item"
        >
          <InputNumber
            // onBlur={selfBlur}
            value={quantity}
            name="request amount"
            // defaultValue={quantity}
            onChange={(e) => setQuantity(e)}
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default RequestModal;
