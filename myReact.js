import { App } from "./App";


class MyReact {
  constructor() {
    this.state = [];
    this.stateIdx = 0;
    this.isRendering = false;
    this.oldVDOM = null;
    this.container = null;
    this.isUpdateScheduled = false;
  }

  createElement = (type, props = {}, ...children) => {
    props = props || {};
    const { key = null, ...restProps } = props;
    
    const normalizedChildren = children.flat().map((child, index) => {
      if (typeof child === 'object' && child !== null && !child.key) {
        child.key = index;  // Assigning a key based on index if not provided
      }
      return child;
    });

    return typeof type === 'function'
      ? type({ ...restProps, children: normalizedChildren })
      : {
          type,
          props: { ...restProps, children: normalizedChildren },
          key,
        };
  };

  createRealDOM = (element) => {
    if (typeof element === "string" || typeof element === "number") {
      return document.createTextNode(String(element));
    }

    if (!element || !element.type) {
      return document.createTextNode('');
    }

    if (typeof element.type === 'function') {
      const renderedElement = element.type(element.props);
      return this.createRealDOM(renderedElement);
    }

    const { key, children, ...props } = element.props;
    const domElement = document.createElement(element.type);
    updateProps(domElement, {}, props);
    this.appendChildren(domElement, children);

    return domElement;
  };

  appendChildren = (domElement, children) => {
    children
      .filter(child => child != null)
      .map(this.createRealDOM)
      .forEach((child) => domElement.appendChild(child));
  };

  renderToDOM = (newVDOM, root) => {
    this.container = root;

    this.oldVDOM
      ? this.diff(root, this.oldVDOM, newVDOM)
      : root.appendChild(this.createRealDOM(newVDOM));

    this.oldVDOM = newVDOM;
    return this;
  };

  useState = (initialValue) => {
    const idx = this.stateIdx;

    if (!this.isRendering)
      throw new Error("useState can only be called during rendering");

    if (this.state[idx] === undefined) this.state[idx] = initialValue;

    const setState = (newValue) => {
      this.state[idx] =
        typeof newValue === "function" ? newValue(this.state[idx]) : newValue;
      this.processUpdate();
    };
    this.stateIdx++;
    return [this.state[idx], setState];
  };

  diff = (parent, oldNode, newNode, index = 0) => {
    const existingNode = parent.childNodes[index];

    if (!newNode) {
      return existingNode && parent.removeChild(existingNode);
    }

    if (!oldNode) {
      return parent.appendChild(this.createRealDOM(newNode));
    }

    if (typeof oldNode === "string" || typeof oldNode === "number") {
      if (typeof newNode === "string" || typeof newNode === "number") {
        if (existingNode && existingNode.textContent !== String(newNode)) {
          existingNode.textContent = String(newNode);
        }
        return;
      } else {
        const newDomNode = this.createRealDOM(newNode);
        return parent.replaceChild(newDomNode, existingNode);
      }
    }

    if (hasNodeChanged(oldNode, newNode)) {
      const newDomNode = this.createRealDOM(newNode);
      return parent.replaceChild(newDomNode, existingNode);
    }

    if (newNode.type) {
      updateProps(existingNode, oldNode.props, newNode.props);
      this.diffChildren(
        existingNode,
        oldNode.props.children,
        newNode.props.children
      );
    }
  };

  diffChildren = (parent, oldChildren = [], newChildren = []) => {
    const oldChildrenKeyed = createKeyedMap(oldChildren);
    const newChildrenKeyed = createKeyedMap(newChildren);

    const handledIndices = this.updateNewChildren(
      parent,
      newChildren,
      oldChildren,
      oldChildrenKeyed
    );

    this.removeOldChildren(
      parent,
      oldChildren,
      newChildrenKeyed,
      handledIndices
    );
  };

  updateNewChildren = (parent, newChildren, oldChildren, oldChildrenKeyed) => {
    const handledIndices = new Set();

    newChildren.forEach((newChild, i) => {
      const oldChild = oldChildrenKeyed[newChild?.key] || oldChildren[i];
      this.diff(parent, oldChild, newChild, i);
      handledIndices.add(i);
    });

    return handledIndices;
  };

  removeOldChildren = (
    parent,
    oldChildren,
    newChildrenKeyed,
    handledIndices
  ) => {
    oldChildren.forEach((oldChild, i) => {
      if (!handledIndices.has(i) && !newChildrenKeyed[oldChild?.key]) {
        this.diff(parent, oldChild, null, i);
      }
    });
  };

  processUpdate = () => {
    if (!this.isUpdateScheduled) {
      this.isUpdateScheduled = true;
      requestAnimationFrame(() => {
        this.isUpdateScheduled = false;
        this.render();
      });
    }
  };

  render = (app = App, container) => {
    this.isRendering = true;
    this.stateIdx = 0;

    container = container || this.container || document.getElementById("root");
    this.renderToDOM(app(), container);

    this.isRendering = false;
    this.stateIdx = 0;
  };
}

const myReactInstance = new MyReact();

export const createElement = myReactInstance.createElement;
export const useState = myReactInstance.useState;
export const render = myReactInstance.render;

export const createKeyedMap = (children) => {
  return children.reduce((acc, child, index) => {
    if (child && child.key != null) acc[child.key] = child;
    else acc[index] = child;
    return acc;
  }, {});
};

export const hasNodeChanged = (node1, node2) => {
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
    if (name === "children") continue;

    if (name === "style") {
      const oldStyle = oldProps[name] || {};
      const newStyle = newProps[name] || {};
      for (let styleName in oldStyle) {
        if (!(styleName in newStyle)) {
          domElement.style[styleName] = "";
        }
      }
    } else if (!(name in newProps)) {
      removeProp(domElement, name, oldProps[name]);
    }
  }
};

export const addNewProps = (domElement, oldProps, newProps) => {
  for (let name in newProps) {
    if (name === "children") continue;

    if (name === "style") {
      const oldStyle = oldProps[name] || {};
      const newStyle = newProps[name] || {};
      for (let styleName in newStyle) {
        let styleValue = newStyle[styleName];
        
        if (typeof styleValue === 'function') {
          styleValue = styleValue();
        }

        if (isPropChanged(oldStyle[styleName], styleValue)) {
          domElement.style[styleName] = styleValue;
        }
      }
    } else if (isPropChanged(oldProps[name], newProps[name])) {
      setProp(domElement, name, newProps[name]);
    }
  }
};

export const removeProp = (domElement, name, value) => {
  if (name.startsWith("on")) {
    const eventType = name.toLowerCase().substring(2);
    domElement.removeEventListener(eventType, value);
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

    const oldValue = domElement._eventListeners && domElement._eventListeners[name];
    if (oldValue) {
      domElement.removeEventListener(eventType, oldValue);
    }

    domElement.addEventListener(eventType, value);

    domElement._eventListeners = domElement._eventListeners || {};
    domElement._eventListeners[name] = value;
  } else if (name === "style") {
    domElement.style.cssText = value;
  } else if (name in domElement) {
    domElement[name] = value;
  } else {
    domElement.setAttribute(name, value);
  }
};

export const isPropChanged = (oldValue, newValue) => {
  return oldValue !== newValue;
};
