import React from "react";
import Card from "./Card";
import { useSelector } from "react-redux";

const CardList = () => {
  const { tree } = useSelector((state) => state);

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
                id={item.id}
              />
            </ul>
          ))
      )}
    </div>
  );
};

export default CardList;
