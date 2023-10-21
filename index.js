import fs from "fs/promises";
import path from "path";

const FILE_PATH = "input/nodes.json";
const OUTPUT_PATH = "output/res.json";

const loadJson = async () => {
  try {
    const jsonRaw = await fs.readFile(path.resolve(FILE_PATH), "utf8");
    return JSON.parse(jsonRaw);
  } catch (error) {
    console.log(error);
  }
};

const saveJson = async (data) => {
  try {
    await fs.writeFile(path.resolve(OUTPUT_PATH), JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

const getSiblings = (array, id) => {
  const [sibling] = array.filter((item) => item.previousSiblingId === id);
  if (sibling) {
    return [sibling, ...getSiblings(array, sibling.nodeId)];
  }
  return [];
};

const sortNodes = (array) => {
  const x = getSiblings(array, null);
  return x;
};

const getChildren = (parentId, nodes) => {
  const children = sortNodes(
    nodes.filter((node) => node.parentId === parentId)
  );

  for (const child of children) {
    child.children = getChildren(child.nodeId, nodes);
  }

  return children;
};

(async () => {
  const nodes = await loadJson();
  const rootLevel = getChildren(null, nodes);
  await saveJson(rootLevel);
})();
