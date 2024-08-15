# My React Impementation

this.state = []: This initializes an empty array to hold the state values for different components. Each call to useState will store its state here.

this.stateIdx = 0: This index tracks which state is currently being accessed during rendering. It helps to ensure that each useState call within a render gets its corresponding state.

this.isRendering = false: A boolean flag that tracks whether the rendering process is currently happening. This prevents useState from being called outside the rendering phase.

this.oldVDOM = null: Stores the previous Virtual DOM (VDOM) so that it can be compared with the new VDOM to determine what needs to be updated in the real DOM.

this.container = null: Holds a reference to the DOM container where the application will be rendered.

this.isUpdateScheduled = false: This boolean flag ensures that updates are batched and scheduled properly using requestAnimationFrame.
We need some variables to implement our custom react
Most pages of our application will be having change of state based on one event and the other. And just like rect we need to up
We use createElement just like react to create the vitual dom, which is represented as javascript object.
To create a normal html element there are 3 important pieces.

1. Element type eg div, h1, span etc
2. Properties and Attributes e.g class, onClick, id etc
3. Content: which is what is contained in the element e.g text or nested html elements.

