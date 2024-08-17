import { App } from "./App";
import { createKeyedMap, hasNodeChanged, updateProps } from "./helper";

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
  

    return (typeof type === 'function') ?type({ ...restProps, children }) : ({
      type,
      props: { ...restProps, children: children.flat() },
      key,
    });
  };
  
  

  createRealDOM = (element) => {
    if (typeof element === "string" || typeof element === "number")
      return document.createTextNode(String(element));

    if (!element || !element.type)
      return document.createTextNode('');

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
  

  // 2. Rendering the Virtual DOM in the container/root
  renderToDOM = (newVDOM, root) => {
    this.container = root;

    this.oldVDOM
      ? this.diff(root, this.oldVDOM, newVDOM)
      : root.appendChild(this.createRealDOM(newVDOM));

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
      this.state[idx] =
        (typeof newValue === "function") ? newValue(this.state[idx]) : newValue;
      this.processUpdate();
    };
    console.log(`Rendering: idx=${idx}, state=`, this.state);
    this.stateIdx++;
    return [this.state[idx], setState];
  };

  // 4. Diffing and Updating the DOM
//   diff = (parent, oldNode, newNode, index = 0) => {
//     const existingNode = parent.childNodes[index];

//     if (!newNode) {
//         return existingNode && parent.removeChild(existingNode);
//     }

//     if (!oldNode) {
//         return parent.appendChild(this.createRealDOM(newNode));
//     }

//     if (hasNodeChanged(oldNode, newNode)) {
//         const newDomNode = this.createRealDOM(newNode);
//         if (existingNode && newDomNode) {
//             return parent.replaceChild(newDomNode, existingNode);
//         } else if (newDomNode) {
//             return parent.appendChild(newDomNode);
//         }
//     }

//     if (newNode.type) {
//         updateProps(existingNode, oldNode.props, newNode.props);
//         this.diffChildren(
//             existingNode,
//             oldNode.props.children,
//             newNode.props.children
//         );
//     }
// };

diff = (parent, oldNode, newNode, index = 0) => {
  const existingNode = parent.childNodes[index];


  if (!newNode) {
      return existingNode && parent.removeChild(existingNode);
  }

  if (!oldNode) {
      return parent.appendChild(this.createRealDOM(newNode));
  }

  // Handling text nodes (numbers and strings)
  if (typeof oldNode === "string" || typeof oldNode === "number") {
      if (typeof newNode === "string" || typeof newNode === "number") {
          if (existingNode.textContent !== String(newNode)) {
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
