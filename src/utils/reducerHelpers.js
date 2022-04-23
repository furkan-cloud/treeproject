export function getAllChildren(beginNode, nodeId) {
  var allChildren = [];
  console.log("beginNode", beginNode);
  const index = beginNode.findIndex((item) => {
    return item.id == nodeId;
  });
  var allChildren = [...beginNode[index].children];
  console.log(allChildren);

  allChildren.forEach(function (childNode) {
    allChildren.push(...getAllChildren(beginNode, childNode));
  });

  return allChildren;
}

export const removeItems = (array, itemsToRemove) => {
  console.log("array", array);
  console.log("itemsToRemove", itemsToRemove);
  return array.tree.filter((v) => {
    return !itemsToRemove.includes(v.id);
  });
};

export function calculatePoint(treeList, parentId, change) {
  const index = treeList.findIndex((item) => {
    return item.id == parentId;
  });
  console.log("parentId", parentId);
  console.log("index", index);
  if (parentId) {
    treeList[index].total += change;
    console.log("worked");
    if (treeList[index].parentId) {
      console.log("d", treeList[index].parentId);
      calculatePoint(treeList, treeList[index].parentId, change);
    }
  }
  return treeList;
}
