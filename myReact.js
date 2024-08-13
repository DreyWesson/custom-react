import { App } from ".";

class MyReact {
  constructor() {
    this.state = [];
    this.stateIdx = 0;
    this.isRendering = false;
    this.oldVDOM = null;
    this.container = null;
    this.isUpdateScheduled = false;
  }

  // 1. Creating a Virtual DOM
  createElement = (type, props = {}, ...children) => {
    return {
      type,
      props: { ...props, children: children.flat() },
      key: props.key || null,
    };
  };

  // 2. Rendering the Virtual DOM to the Real DOM
  render = (element, container) => {
    this.container = container;
    const newVirtualDOM = element;

    if (this.oldVDOM) this.diff(container, this.oldVDOM, newVirtualDOM);
    else container.appendChild(this.createRealDOM(newVirtualDOM));

    this.oldVDOM = newVirtualDOM;
  };

  // 3. Managing State
  useState = (initialValue) => {
    if (!this.isRendering)
      throw new Error("useState can only be called during rendering");

    const idx = this.stateIdx;

    if (this.state[idx] === undefined) this.state[idx] = initialValue;

    const setState = (newValue) => {
      this.state[idx] = newValue;
      this.scheduleUpdate();
    };

    this.stateIdx++;
    return [this.state[idx], setState];
  };

  // 4. Diffing and Updating the DOM
  diff = (parent, oldNode, newNode, index = 0) => {
    const existingNode = parent.childNodes[index];

    if (!newNode) {
      if (existingNode) parent.removeChild(existingNode);
      return;
    }

    if (!oldNode) {
      parent.appendChild(this.createRealDOM(newNode));
      return;
    }

    if (this.hasNodeChanged(oldNode, newNode)) {
      parent.replaceChild(this.createRealDOM(newNode), existingNode);
      return;
    }

    if (newNode.type) {
      this.updateProps(existingNode, oldNode.props, newNode.props);
      this.diffChildren(
        existingNode,
        oldNode.props.children,
        newNode.props.children
      );
    }
  };

  diffChildren = (parent, oldChildren = [], newChildren = []) => {
    const oldChildrenKeyed = this.createKeyedMap(oldChildren);
    const newChildrenKeyed = this.createKeyedMap(newChildren);

    // Track indices of processed children
    const handledIndices = new Set();

    // Loop through new children and reconcile with old children
    newChildren.forEach((newChild, i) => {
      const oldChild = oldChildrenKeyed[newChild?.key] || oldChildren[i];
      this.diff(parent, oldChild, newChild, i);
      handledIndices.add(i);
    });

    // Remove any old children not present in new children
    oldChildren.forEach((oldChild, i) => {
      if (!handledIndices.has(i) && !newChildrenKeyed[oldChild?.key]) {
        this.diff(parent, oldChild, null, i);
      }
    });
  };

  createKeyedMap = (children) => {
    return children.reduce((acc, child, index) => {
      if (child && child.key !== null) acc[child.key] = child;
      else acc[index] = child; // Fallback to index if no key
      return acc;
    }, {});
  };

  isPropChanged = (oldProp, newProp) => {
    if (typeof oldProp === "object" && typeof newProp === "object") {
      return JSON.stringify(oldProp) !== JSON.stringify(newProp);
    }
    return oldProp !== newProp;
  };

  hasNodeChanged = (node1, node2) => {
    return (
      typeof node1 !== typeof node2 ||
      ((typeof node1 === "string" || typeof node1 === "number") &&
        node1 !== node2) ||
      node1.type !== node2.type ||
      node1.key !== node2.key
    );
  };

  // 5. Handling DOM Updates
  scheduleUpdate = () => {
    if (!this.isUpdateScheduled) {
      this.isUpdateScheduled = true;
      requestAnimationFrame(() => this.processUpdate());
    }
  };

  processUpdate = () => {
    this.renderApp();
    this.isUpdateScheduled = false;
  };

  renderApp = () => {
    this.startRender();
    const root = this.container || document.getElementById("root");
    this.render(App(), root);
    this.endRender();
  };

  startRender = () => {
    this.isRendering = true;
    this.stateIdx = 0;
  };

  endRender = () => {
    this.isRendering = false;
    this.stateIdx = 0;
  };


  createRealDOM = (element) => {
    if (typeof element === "string" || typeof element === "number") {
      return document.createTextNode(String(element));
    }

    const domElement = document.createElement(element.type);
    this.updateProps(domElement, {}, element.props);
    this.appendChildren(domElement, element.props.children);
    return domElement;
  };

  updateProps = (domElement, oldProps, newProps) => {
    this.removeOldProps(domElement, oldProps, newProps);
    this.addNewProps(domElement, oldProps, newProps);
  };

  appendChildren = (domElement, children) => {
    children
      .map(this.createRealDOM)
      .forEach((child) => domElement.appendChild(child));
  };

  removeOldProps = (domElement, oldProps, newProps) => {
    for (let name in oldProps) {
      if (name === "children") continue;
      if (!(name in newProps)) {
        this.removeProp(domElement, name, oldProps[name]);
      }
    }
  };

  addNewProps = (domElement, oldProps, newProps) => {
    for (let name in newProps) {
      if (name === "children") continue;
      if (this.isPropChanged(oldProps[name], newProps[name])) {
        this.setProp(domElement, name, newProps[name]);
      }
    }
  };

  removeProp = (domElement, name, value) => {
    if (name.startsWith("on")) {
      domElement.removeEventListener(name.toLowerCase().substring(2), value);
    } else if (name === "style") {
      domElement.style = "";
    } else if (name in domElement) {
      domElement[name] = "";
    } else {
      domElement.removeAttribute(name);
    }
  };

  setProp = (domElement, name, value) => {
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
}

// Exporting the instance and utility functions
const myReactInstance = new MyReact();

export const createElement = myReactInstance.createElement;
export const render = myReactInstance.render;
export const useState = myReactInstance.useState;
export const renderApp = myReactInstance.renderApp;
