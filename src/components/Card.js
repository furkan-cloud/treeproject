import React, { useState, useEffect } from "react";
import { Form, Card, Avatar, Input, InputNumber } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Request from "./Request";
import { updateCard } from "../redux/actions/tree";
import DropdownMenu from "./DropdownMenu";

const TreeCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.id)
  );
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(cardItem?.self || 0);
  const [inputs, setInputs] = useState();
  const [name, setName] = useState(cardItem?.name || "");

  const onChangeAll = (inputs) => {
    setInputs({ ...inputs });
    form.setFieldsValue({
      name: `${inputs.name}`,
      selfnumber: `${inputs.self}`,
    });
  };

  useEffect(() => {
    onChangeAll(cardItem);
  }, [cardItem]);


  const selfBlur = async (e) => {
    dispatch(
      updateCard({
        id: cardItem.id,
        name: name,
        self: Number(quantity),
        total: cardItem.total,
      })
    );
  };

  const handleVisible = () => {
    setVisible(true);
  };

  return (
    <li>
      <Card
      className="card-item"
        extra={
          <>
            <DropdownMenu
              key={cardItem?.id}
              itemId={cardItem?.id}
              parentId={cardItem?.parentId}
              setVisible={handleVisible}
            />
          </>
        }
      >
        <Form
          name="normal_login"
          form={form}
          className="cart__form"
          initialValues={{ remember: true }}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 20 }}
        >
          <div
          className="cart__form-header"
          >
            <Avatar src="https://joeschmoe.io/api/v1/random" />
            <Form.Item name="name" initialValue={props.name}>
              <Input
                value={props.name}
                onBlur={selfBlur}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Self"
            name="selfnumber"
            className="cart__form__item"
            initialValue={quantity}
          >
            <InputNumber
              value={quantity}
              onBlur={selfBlur}
              name="selfnumber"
              onChange={(e) => setQuantity(e)}
            />
          </Form.Item>
        </Form>
        <div>Total: {cardItem.total}</div>
        <Request visible={visible} setVisible={setVisible} id={cardItem.id} />
      </Card>
      <div>
        <ul>
          {cardItem?.children?.length > 0
            ? cardItem?.children?.map((key) => <TreeCard key={key} id={key} />)
            : null}
        </ul>
      </div>
    </li>
  );
};

export default TreeCard;
