import { Modal, Select, Form, InputNumber } from "antd";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { requestPoint } from "../redux/actions/tree";

const { Option } = Select;
const RequestModal = (props) => {
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { tree } = useSelector((state) => state);
  const dispatch = useDispatch();

  function handleChange(value) {
    const cardItem = tree.find((item) => item.name === value);
    setName(cardItem);
  }

  const handleOk = () => {
    setConfirmLoading(true);

    const index = tree.findIndex((item) => {
      return item.id == props.id;
    });
    if (name.self > quantity) {
      props.setVisible(false);
      props.handleAlert("request sent");
      setConfirmLoading(false);
      dispatch(
        requestPoint({
          id: props.id,
          receiverId: name.id,
          name: props.name,
          requestPoint: quantity,
          status: "pending",
        })
      );
    } else {
      props.setVisible(false);
      props.handleAlert("Insufficient points");
      setConfirmLoading(false);
      dispatch(
        requestPoint({
          id: props.id,
          receiverId: name.id,
          name: props.name,
          requestPoint: quantity,
          status: "rejected",
        })
      );
    }
  };

  const handleCancel = () => {
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
            value={quantity}
            name="request amount"
            onChange={(e) => setQuantity(e)}
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default RequestModal;
