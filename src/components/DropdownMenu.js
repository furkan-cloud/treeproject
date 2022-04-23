import React from "react";
import { Dropdown, Menu } from "antd";
import {
  EllipsisOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addCard, deleteCard } from "../redux/actions/tree";

const DropdownMenu = (props) => {
    const dispatch = useDispatch();
      const cardItem = useSelector((state) =>
      state.tree.find((item) => item.id === props.itemId)
    );
      
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
      dispatch(
        addCard({
          data,
        })
      );
    };
  
    const removeItem = () => {
      dispatch(
        deleteCard({
          props,
        })
      );
    };
  
    const makeRequest = () => {
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

export default DropdownMenu