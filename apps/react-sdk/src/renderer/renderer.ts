import { PropsWithChildrenContent } from "../types";

/**
 * Normalizes given props with render children to string and save value to `childrenContent` prop
 * @private
 * @param {Any} props 
 * @returns {Any} normalized props.
 */
function normalizeProps<P = any>(props: any): PropsWithChildrenContent<P> {
  return { 
    ...props, 
    childrenContent: render(props.children),
  }
}

/**
 * Executes a `render` method on a given component (in the case of a class component)
 * or executes the component itself (a functional component) to get pure string or complex value for the next operations
 * @private
 * @param {React.ReactElement} element a given component or complex form
 * @returns {(React.ReactElement | string)}
 */
function createElement(element: any): React.ReactElement | string {
  if (element === null || element === undefined || typeof element === 'boolean') {
    return "";
  }
  if (typeof element === 'number' || typeof element === 'bigint') {
    return String(element);
  }
  if (typeof element === 'string') {
    return element;
  }
  const typeOf = typeof element.type;

  if (typeOf === 'string') {
    // HTML (also not standard) tags case
    throw new Error("HTML tags is not supported yet.");
  } else if (typeOf === 'symbol') {
    // internal React types like Fragments, Portal etc. We skip them.
    return render(element.props.children);
  } else if (typeOf === 'function') {
    // custom components case
    const type = element.type as any;
    const prototype = type.prototype;

    // Class component case
    if (prototype && typeof prototype.isReactComponent === "object") {
      const clazzComp = new type(normalizeProps(element.props));
      return createElement(clazzComp.render());
    }
    // Function component case
    return createElement(type(normalizeProps(element.props)));
  }

  return render(element) || "";
}

/**
 * Renders given component to string
 * 
 * @param {ReactNode} component a given component to rendering
 * @example
 * function Component({ textProp }) {
 *   return <>{textProp}</>
 * }
 * render(<Component textProp="someText" />)
 * @returns {string}
 */
export function render(component: React.ReactNode): string {
  let content = "";
  const typeOf = typeof component;
  if (typeOf === 'string') {
    content += component;
  } else if (typeOf === 'number' || typeOf === 'bigint') {
    content += String(component);
  } else if (Array.isArray(component)) {
    content += component.map(child => {
      const childValue = createElement(child as React.ReactElement);
      return render(childValue);
    }).join("");
  } else if (typeOf === "object" && component !== null) {
    content += createElement(component as React.ReactElement);
  }
  return content;
}
