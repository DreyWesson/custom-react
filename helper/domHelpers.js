import { updateProps, hasNodeChanged, createKeyedMap } from "./index";

export const handleHTML = (element) => {
  const { key, children, ...props } = element.props;
  const domElement = document.createElement(element.type);

  updateProps(domElement, {}, props);
  appendChildren(domElement, children);

  return domElement;
};

export const createRealDOM = (element) => {
  if (typeof element === "string" || typeof element === "number") {
    return document.createTextNode(String(element));
  }
  if (!element || !element.type) {
    return document.createTextNode("");
  }

  if (typeof element.type === "function") {
    const renderedElement = element.type(element.props);
    return createRealDOM(renderedElement);
  }

  return handleHTML(element);
};

export const appendChildren = (domElement, children) => {
  children
    .filter((child) => {
      return (
        child != null &&
        child !== false &&
        child !== "" &&
        typeof child !== "boolean"
      );
    })
    .map((child) => createRealDOM(child))
    .forEach((child) => domElement.appendChild(child));
};

export const diff = (parent, oldNode, newNode, index = 0) => {
  const existingNode = parent.childNodes[index];

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (existingNode.nodeType === Node.TEXT_NODE) {
      if (existingNode.textContent !== String(newNode)) {
        existingNode.textContent = String(newNode);
      }
    } else {
      const newTextNode = document.createTextNode(String(newNode));
      parent.replaceChild(newTextNode, existingNode);
    }
    return;
  }

  if (!newNode) {
    if (existingNode) parent.removeChild(existingNode);
    return;
  }

  if (!oldNode) {
    parent.appendChild(createRealDOM(newNode));
    return;
  }

  if (hasNodeChanged(oldNode, newNode)) {
    const newDomNode = createRealDOM(newNode);
    parent.replaceChild(newDomNode, existingNode);
    return;
  }

  if (newNode.type) {
    updateProps(existingNode, oldNode.props, newNode.props);
    diffChildren(existingNode, oldNode.props.children, newNode.props.children);
  }
};

export const diffChildren = (parent, oldChildren = [], newChildren = []) => {
  const oldChildrenKeyed = createKeyedMap(oldChildren);
  const newChildrenKeyed = createKeyedMap(newChildren);

  const handledIndices = updateNewChildren(
    parent,
    newChildren,
    oldChildren,
    oldChildrenKeyed
  );

  removeOldChildren(parent, oldChildren, newChildrenKeyed, handledIndices);
};

export const updateNewChildren = (
  parent,
  newChildren,
  oldChildren,
  oldChildrenKeyed
) => {
  const handledIndices = new Set();

  newChildren.forEach((newChild, i) => {
    const oldChild = oldChildrenKeyed[newChild?.key] || oldChildren[i];
    diff(parent, oldChild, newChild, i);
    handledIndices.add(i);
  });

  return handledIndices;
};

export const removeOldChildren = (
  parent,
  oldChildren,
  newChildrenKeyed,
  handledIndices
) => {
  oldChildren.forEach((oldChild, i) => {
    if (!handledIndices.has(i) && !newChildrenKeyed[oldChild?.key]) {
      diff(parent, oldChild, null, i);
    }
  });
};
