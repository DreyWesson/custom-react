import { App } from ".";
import {
  createKeyedMap,
  hasNodeChanged,
  updateProps,
} from "./helper";

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

  createRealDOM = (element) => {
    if (typeof element === "string" || typeof element === "number") {
      return document.createTextNode(String(element));
    }
    const { key, children, ...props } = element.props;
    const domElement = document.createElement(element.type);
    updateProps(domElement, {}, props);
    this.appendChildren(domElement, children);
    return domElement;
  };

  // 2. Rendering the Virtual DOM to the Real DOM
  render = (newVDOM, container) => {
    this.container = container;
    this.isRendering = true;
    this.stateIdx = 0;

    this.oldVDOM
      ? this.diff(container, this.oldVDOM, newVDOM)
      : container.appendChild(this.createRealDOM(newVDOM));

    this.oldVDOM = newVDOM;
    return this;
  };

  // 3. Managing State
  useState = (initialValue) => {
    const idx = this.stateIdx;

    if (!this.isRendering)
      throw new Error("useState can only be called during rendering");

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

    if (!newNode) return existingNode && parent.removeChild(existingNode);

    if (!oldNode) return parent.appendChild(this.createRealDOM(newNode));

    if (hasNodeChanged(oldNode, newNode))
      return parent.replaceChild(this.createRealDOM(newNode), existingNode);

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
    this.isRendering = true;
    this.stateIdx = 0;
    const root = this.container || document.getElementById("root");
    const app_ = App();
    this.render(app_, root);
    this.isRendering = false;
    this.stateIdx = 0;
  };

  appendChildren = (domElement, children) => {
    children
      .map(this.createRealDOM)
      .forEach((child) => domElement.appendChild(child));
  };
}

const myReactInstance = new MyReact();

export const createElement = myReactInstance.createElement;
export const render = myReactInstance.render;
export const useState = myReactInstance.useState;
export const renderApp = myReactInstance.renderApp;
