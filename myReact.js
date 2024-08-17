import { App } from "./App.jsx";
import {createKeyedMap, hasNodeChanged, updateProps} from "./helper/index"

class MyReactBase { // Manages state and rendering.
  constructor() {
    this.state = [];
    this.stateIdx = 0;
    this.isRendering = false;
    this.oldVDOM = null;
    this.container = null;
    this.isUpdateScheduled = false;
  }

  useState = (initialValue) => {
    const idx = this.stateIdx;

    if (!this.isRendering) {
      throw new Error("useState can only be called during rendering");
    }

    if (this.state[idx] === undefined) {
      this.state[idx] = initialValue;
    }

    const setState = (newValue) => {
      this.state[idx] = typeof newValue === "function"
        ? newValue(this.state[idx])
        : newValue;
      this.processUpdate();
    };
    this.stateIdx++;

    return [this.state[idx], setState];
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

  render = (app, container) => {
    this.isRendering = true;
    this.stateIdx = 0;

    container = container || this.container || document.getElementById("root");
    this.renderToDOM(app(), container);

    this.isRendering = false;
    this.stateIdx = 0;
  };
}


class MyReactDOM extends MyReactBase { // Handles real DOM creation and updating
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
}

class MyReactDiff extends MyReactDOM { // Manages diffing between old and new virtual DOMs
  diff = (parent, oldNode, newNode, index = 0) => {
    const existingNode = parent.childNodes[index];

    if (typeof newNode === 'string' || typeof newNode === 'number') {
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
      if (existingNode) 
        parent.removeChild(existingNode);
      return;
    }

    if (!oldNode) {
      parent.appendChild(this.createRealDOM(newNode));
      return;
    }

    if (hasNodeChanged(oldNode, newNode)) {
      const newDomNode = this.createRealDOM(newNode);
      parent.replaceChild(newDomNode, existingNode);
      return;
    }

    if (newNode.type) {
      updateProps(existingNode, oldNode.props, newNode.props);
      this.diffChildren(existingNode, oldNode.props.children, newNode.props.children);
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
}


class MyReact extends MyReactDiff { // Main class that exports the public API
  constructor() {
    super();
  }

  createElement = (type, props = {}, ...children) => {
    props = props || {};
    const { key = null, ...restProps } = props;

    const normalizedChildren = children.flat().map((child, index) => {
      if (typeof child === 'object' && child !== null && !child.key) {
        child.key = index;
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
