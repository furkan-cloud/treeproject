import React, { useState, useEffect } from "react";
import { Form, Dropdown, Card, Avatar, Input, Menu, InputNumber } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  MailOutlined,
  AppstoreOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import JSONDigger from "json-digger";
import { v4 as uuidv4 } from "uuid";
// import { createCard, addCard, deleteCard } from "../redux/reducers";
import appReducer from "../redux/reducers";
import Request from "./Request";

const { Meta } = Card;
const { SubMenu } = Menu;

const Dummy = (props) => {
  const dispatch = useDispatch();
  const { tree, selectedNode } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.itemId)
  );

  console.log("dummy", cardItem);

  const [newNodes, setNewNodes] = useState([
    { name: "", self: 0, total: 0, requests: [], error: [] },
  ]);
  console.log("dummyprops", props);

  const addNewCard = () => {
    // console.log("createcart", props.itemId);
    // console.log("itemadd", props);
    // console.log("item");
    const data = {
      id: uuidv4(),
      parentId: cardItem.id,
      name: "",
      self: 0,
      total: 0,
      requests: [],
      liveRequests: [],
      // error: [],
      children: [],
    };
    console.log("addcarddata", data);
    dispatch({
      type: "addCard",
      payload: data,
    });
    // dispatch(addCard(data));
  };

  const removeItem = () => {
    console.log("deleteid", props);
    dispatch({
      type: "deleteCard",
      payload: props,
    });
    // dispatch(deleteCard(props));
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
      {/* <Menu.Item onClick={requestLog} key="4">Request Log</Menu.Item> */}
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
              // backgroundColor: "#f0f0f0",
              // borderRadius: "50%",
            }}
          />
        }
      ></Dropdown.Button>
    </div>
  );
};

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="https://www.antgroup.com">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="https://www.aliyun.com">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);

function handleClick(e) {
  console.log("click", e);
}

const TreeCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const cardItem = useSelector((state) =>
    state.tree.find((item) => item.id === props.id)
  );
  const [number, setNumber] = useState(0);
  const { tree, selectedNode } = useSelector((state) => state);
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
    // setQuantity(() => cardItem?.self);
    onChangeAll(cardItem);
    console.log("useeffect", cardItem);
  }, [cardItem]);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
  };

  console.log("props", props);

  function postOrder(root) {
    if (root.children) {
      console.log("inside");
      root.total = 0;
      root.children.forEach((child) => {
        console.log("child", child);
        console.log("root", root);
        console.log("roottotal", root.total);
        root.total += postOrder(child);
      });
      root.total += root.self;
    } else {
      root.total = root.self;
    }
    return root.total;
  }

  const selfBlur = async (e) => {
    console.log("e", e);
    console.log("e", props);
    console.log("cardItem", cardItem);
    const data = {
      id: cardItem.id,
      name: name,
      self: Number(quantity),
      total: cardItem.total,
    };
    console.log("updateitemdata", data);
    dispatch({
      type: "updateCard",
      payload: data,
    });
    // await setNumber(Number(e.target.value));
    // updateItem(props,e.target.value);
  };

  console.log("number", number);

  // useEffect(() => {
  //   console.log("useeffect");
  //   updateItem();
  // }, [number]);

  const handleVisible = () => {
    setVisible(true);
  };

  const onFieldsChange = (changedFields, allFields) => {
    console.log(changedFields);
    console.log("all", allFields);
    const changedName =
      allFields[0].name[0] == "name" ? allFields[0].value : "";
    const changedField =
      allFields[1].name[0] == "number" ? allFields[1].value : "";
  };

  const updateItem = (props, value) => {
    console.log("updateitem", props, value);
    const data = {
      id: props.id,
      name: props.name,
      self: value,
      total: props.total,
    };
    console.log("updateitemdata", data);
    dispatch({
      type: "updateCard",
      payload: data,
    });
    // dispatch(updateCard(data));
  };

  return (
    <li>
      <Card
        style={{ maxWidth: "220px", margin: "auto", position: "relative" }}
        extra={
          <>
            {/* <Meta avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />} /> */}
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
          onFieldsChange={onFieldsChange}
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
              // defaultValue={course?.Quantity}
              onChange={(e) => setQuantity(e)}
            />
          </Form.Item>
          {/* <Form.Item
            label="Amount"
            name="amount"
            initialValue={cardItem.total}
            shouldUpdate={(prevValues, curValues) =>
              prevValues.total !== curValues.total
            }
          >
            <Input value={cardItem.total} defaultValue={cardItem.total} />
          </Form.Item> */}
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
