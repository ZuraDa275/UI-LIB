import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
  VNode,
} from "snabbdom";

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

let container = document.getElementById("app") as HTMLElement | VNode;

type EventObj = {
  eventType: string;
  eventCallback: (e?: Event) => void;
};

interface TempleFunc {
  <V>(templateString: TemplateStringsArray, ...args: V[]): VNode;
  addEvent?: EventObj;
}

function template(tag: string) {
  const createVNode: TempleFunc = <V>(
    templateString: TemplateStringsArray,
    ...args: V[]
  ) => {
    const eventObj = createVNode.addEvent;
    return h("div#app", {}, [
      h(
        tag,
        {
          hook: {
            update: () => console.log("Component updated!"),
            insert: () => console.log("Component Mounted"),
          },
          on: eventObj ? { [eventObj.eventType]: eventObj.eventCallback } : {},
        },
        templateString.reduce(
          (acc, initialString, index) =>
            acc + initialString + (args[index] || ""),
          ""
        )
      ),
    ]);
  };
  return createVNode;
}

// Initializing the HTML elements
const h1 = template("h1");
const button = template("button");

//State
let count = 0;

const Component = <T>(state: T) => {
  //Adding event handlers to the elements
  button.addEvent = {
    eventType: "click",
    eventCallback: () => updateState((state as number) + 1),
  };
  return [h1`Count: ${state}`, button`Add`];
};

function updateState<T>(state: T) {
  const newNode = Component(state);
  container = patch(container, h("div#app", {}, newNode));
}

container = patch(container, h("div#app", {}, Component(count)));
