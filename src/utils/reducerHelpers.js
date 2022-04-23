export function getAllChildren(beginNode, nodeId) {
  var allChildren = [];
  const index = beginNode.findIndex((item) => {
    return item.id == nodeId;
  });
  var allChildren = [...beginNode[index].children];

  allChildren.forEach(function (childNode) {
    allChildren.push(...getAllChildren(beginNode, childNode));
  });

  return allChildren;
}

export const removeItems = (array, itemsToRemove) => {
  return array.tree.filter((v) => {
    return !itemsToRemove.includes(v.id);
  });
};

export function calculatePoint(treeList, parentId, change) {
  const index = treeList.findIndex((item) => {
    return item.id == parentId;
  });
  if (parentId) {
    treeList[index].total += change;
    if (treeList[index].parentId) {
      calculatePoint(treeList, treeList[index].parentId, change);
    }
  }
  return treeList;
}
