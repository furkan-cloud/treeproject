import React from "react";
import Card from "./Card";
import { useSelector, useDispatch } from "react-redux";

const CardList = () => {
  const dispatch = useDispatch();
  const { tree, selectedNode } = useSelector((state) => state);

  return (
    <div className="tree">
      {tree.length < 1 ? (
        <h1>There is no data to show</h1>
      ) : (
        tree
          ?.filter((item) => !item?.parentId)
          .map((item) => (
            <ul key={item.id}>
              <Card
                // name={item.name}
                // self={item.self}
                // total={item.total}
                id={item.id}
                // parentId={item.parentId}
              />

              {/* {item.children?.length > 0
                ? item.children.map((key) => (
                    <div>
                      <ul>
                        <Card
                          key={item.id}
                          name={item.name}
                          self={item.self}
                          total={item.total}
                          id={item.id}
                          parentId={item.parentId}
                        />
                      </ul>
                    </div>
                  ))
                : null} */}
            </ul>
          ))
      )}
    </div>
  );
};

export default CardList;
