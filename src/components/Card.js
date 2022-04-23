import React, { useState, useEffect } from "react";
import { Form, Dropdown, Card, Avatar, Input, Menu, InputNumber } from "antd";
import {
  EllipsisOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Request from "./Request";
import { addCard, updateCard, deleteCard } from "../redux/actions/tree";

const Dummy = (props) => {
  const dispatch = useDispatch();

  const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.itemId)
  );

  console.log("dummy", cardItem);


  const addNewCard = () => {

    const data = {
      id: uuidv4(),
      parentId: cardItem.id,
      name: "",
      self: 0,
      total: 0,
      requests: [],
      liveRequests: [],
      children: [],
    };
    console.log("addcarddata", data);
    dispatch(
      addCard({
        data,
      })
    );
  };

  const removeItem = () => {
    console.log("deleteid", props);
    dispatch(
      deleteCard({
        props,
      })
    );
  };

  const makeRequest = () => {
    console.log("makerequest", props);
    props.setVisible(true);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={addNewCard}>
        Add Card
      </Menu.Item>
      <Menu.Item key="2" onClick={removeItem}>
        Remove Card
      </Menu.Item>
      <Menu.Item onClick={makeRequest} key="3">
        Make Request
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown.Button
        style={{ float: "right" }}
        className="dropdown-btn"
        overlay={userMenu}
        trigger={["click"]}
        icon={
          <EllipsisOutlined
            style={{
              fontSize: "28px",
            }}
          />
        }
      ></Dropdown.Button>
    </div>
  );
};

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

  console.log("item", cardItem);

  const onChangeAll = (inputs) => {
    setInputs({ ...inputs });
    form.setFieldsValue({
      name: `${inputs.name}`,
      selfnumber: `${inputs.self}`,
    });
  };

  useEffect(() => {
    onChangeAll(cardItem);
    console.log("useeffect", cardItem);
  }, [cardItem]);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
  };

  const selfBlur = async (e) => {
    console.log("e", e);
    console.log("e", props);
    console.log("cardItem", cardItem);
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
        style={{ maxWidth: "220px", margin: "auto", position: "relative" }}
        extra={
          <>
            <Dummy
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
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 20 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "17px",
              paddingLeft: "20px",
            }}
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
