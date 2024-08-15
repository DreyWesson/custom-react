export const createKeyedMap = (children) => {
  return children.reduce((acc, child, index) => {
    if (child && child.key !== null) acc[child.key] = child;
    else acc[index] = child;
    return acc;
  }, {});
};

export const hasNodeChanged = (node1, node2) => {
  console.log({node1, node2})
  return (
    typeof node1 !== typeof node2 ||
    ((typeof node1 === "string" || typeof node1 === "number") &&
      node1 !== node2) ||
    node1.type !== node2.type ||
    node1.key !== node2.key
  );
};

export const updateProps = (domElement, oldProps, newProps) => {
  removeOldProps(domElement, oldProps, newProps);
  addNewProps(domElement, oldProps, newProps);
};

export const removeOldProps = (domElement, oldProps, newProps) => {
  for (let name in oldProps) {
    if (name === "children" || name === "key") continue;
    if (!(name in newProps)) removeProp(domElement, name, oldProps[name]);
  }
};

export const addNewProps = (domElement, oldProps, newProps) => {
  for (let name in newProps) {
    if (name === "children" || name === "key") continue;
    if (isPropChanged(oldProps[name], newProps[name]))
      setProp(domElement, name, newProps[name]);
  }
};

export const removeProp = (domElement, name, value) => {
  if (name.startsWith("on")) {
    const eventType = name.toLowerCase().substring(2);
    domElement.removeEventListener(eventType);
  } else if (name === "style") {
    domElement.style = "";
  } else if (name in domElement) {
    domElement[name] = "";
  } else {
    domElement.removeAttribute(name);
  }
};

export const setProp = (domElement, name, value) => {
  if (name.startsWith("on")) {
    const eventType = name.toLowerCase().substring(2);
    domElement.addEventListener(eventType, value);
  } else if (name === "style") {
    Object.assign(domElement.style, value || {});
  } else if (name in domElement) {
    domElement[name] = value;
  } else {
    domElement.setAttribute(name, value);
  }
};

export const isPropChanged = (oldProp, newProp) => {
  if (typeof oldProp === "object" && typeof newProp === "object") {
    return JSON.stringify(oldProp) !== JSON.stringify(newProp);
  }
  return oldProp !== newProp;
};
