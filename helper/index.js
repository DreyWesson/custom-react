export const createKeyedMap = (children) => {
  return children.reduce((acc, child, index) => {
    if (child && child.key !== null) acc[child.key] = child;
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
  // console.log("Updating props", { oldProps, newProps });
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
          // console.log(`Removing style: ${styleName} (value: ${oldStyle[styleName]})`);
          domElement.style[styleName] = "";
        }
      }
    } else if (!(name in newProps)) {
      // console.log(`Removing prop: ${name} (value: ${oldProps[name]})`);
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
          // console.log(`Setting style: ${styleName} (value: ${styleValue})`);
          domElement.style[styleName] = styleValue;
        }
      }
    } else if (isPropChanged(oldProps[name], newProps[name])) {
      // console.log(`Setting prop: ${name} (value: ${newProps[name]})`);
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
    // console.log(`Attaching event: ${eventType}`);
    domElement.addEventListener(eventType, value);
  } else if (name === "style") {
    // console.log(`Setting style: ${JSON.stringify(value)}`);
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
