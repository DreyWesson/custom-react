import { App } from ".";

const createElement = (type, props = {}, ...children) => {
  return { type, props: { ...props, children } };
};

const render = (element, container) => {
  if (typeof element === "string" || typeof element === "number") {
    container.appendChild(document.createTextNode(String(element)));
    return;
  }
  const domElement = document.createElement(element.type);
  if (element.props) {
    Object.keys(element.props)
      .filter((key) => key !== "children")
      .forEach((key) => {
        if (key.startsWith("on")) {
          const eventType = key.toLowerCase().substring(2);
          domElement.addEventListener(eventType, element.props[key]);
        } else {
          domElement[key] = element.props[key];
        }
      });
  }
  if (element.props.children) {
    element.props.children.forEach((child) => render(child, domElement));
  }
  container.appendChild(domElement);
};

let state = [];
let setters = [];
let stateIdx = 0;
let isRendering = false;

const useState = (initVal) => {
  if (!isRendering) {
    throw new Error("useState can only be called during rendering");
  }

  const idx = stateIdx;

  if (state[idx] === undefined) {
    state[idx] = initVal;
  }

  const setState = (newVal) => {
    state[idx] = newVal;
    renderApp();
  };

  stateIdx++;
  return [state[idx], setState];
};

const renderApp = () => {
  stateIdx = 0;
  isRendering = true;
  const root = document.getElementById("root");
  root.innerHTML = "";
  render(App(), root);
  isRendering = false;
};

export { createElement, render, useState, renderApp };
