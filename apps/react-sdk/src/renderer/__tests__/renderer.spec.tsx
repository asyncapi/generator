import React from 'react';
import { render } from "../..";

describe('Renderer', () => {
  test('should render works when element is string', () => {
    const content = render("Test 1");
    expect(content).toEqual("Test 1");
  });

  test('should render works when element is a Funcion Component', () => {
    function Test() {
      return <>Test 2</>
    }

    const content = render(<Test />);
    expect(content).toEqual("Test 2");
  });

  test('should render works when element is a Class Component', () => {
    class Test extends React.Component {
      constructor(props: any) { super(props) } 
      
      render() {
        return <>Test 3</>
      }
    }

    const content = render(<Test />);
    expect(content).toEqual("Test 3");
  });

  test('should render works with nested hierarchy', () => {
    function NestedComponent() {
      return <>Nested Component</>
    }

    function FunctionComponent() {
      return <>Function Component <NestedComponent />{"\n"}</>
    }

    class ClassComponent extends React.Component {
      constructor(props: any) { super(props) } 
      
      render() {
        return <>Class Component{"\n"}</>
      }
    }

    const content = render(
      <>
        some inlined text{"\n"}
        <FunctionComponent />
        <ClassComponent />
      </>
    );
    expect(content).toEqual("some inlined text\nFunction Component Nested Component\nClass Component\n");
  });

  test('should render works with props', () => {
    function Test({ someProp }: { someProp?: string }) {
      if (!someProp) {
        return <Test someProp="Nested prop" />;
      }
      
      return <>{someProp}</>
    }

    const content = render(<Test />);
    expect(content).toEqual("Nested prop");
  });

  test('should render works with null as returned value', () => {
    function Test() {
      return null;
    }

    const content = render(<Test />);
    expect(content).toEqual("");
  });

  test('should render works nested null value', () => {
    function NullComponent() {
      return null;
    }

    function NestedComponent() {
      return (
        <>
          <NullComponent />
          some text
        </>
      );
    }

    function Component() {
      return (
        <>
          <NullComponent />
          <NestedComponent />
          <NullComponent />
        </>
      );
    }

    const content = render(<Component />);
    expect(content).toEqual("some text");
  });

  test('should works with array as returned value', () => {
    function Component({ text }: { text: string }) {
      return <>{text}</>
    }

    function Test() {
      return [
        <Component text={'some'} />,
        <Component text={' text'} />,
        <Component text={' is rendered'} />,
      ] as any;
    }

    const content = render(<Test />);
    expect(content).toEqual("some text is rendered");
  });
  
  test('should throws error due to using React hooks', () => {
    function Component() {
      const [someState, setSomeState] = React.useState();
      return null;
    }

    let error = undefined;
    try {
      render(<Component />);
    } catch(err) {
      error = err;
    }
    // check substring of the desired error
    expect((error as Error).message).toContain('Invalid hook call.');
  });

  test('should skips internal React components', () => {
    function Component() {
      return (
        <React.Suspense fallback={'...loading'}>
          some text
        </React.Suspense>
      )
    }

    const content = render(<Component />);
    expect(content).toEqual("some text");
  });

  test('should throws error due to using HTML tags', () => {
    function Component() {
      return (
        <div>
          some text
        </div>
      )
    }

    let error = undefined;
    try {
      render(<Component />);
    } catch(err) {
      error = err;
    }
    // check substring of the desired error
    expect((error as Error).message).toEqual('HTML tags is not supported yet.');
  });

  test('should render direct numeric values correctly', () => {
    expect(render(0)).toEqual("0");
    expect(render(8080)).toEqual("8080");
    expect(render(-42)).toEqual("-42");
    expect(render(3.14)).toEqual("3.14");
    expect(render(BigInt(0))).toEqual("0");
    expect(render(BigInt(100))).toEqual("100");
  });

  test('should render empty string for booleans, null, and undefined', () => {
    expect(render(null)).toEqual("");
    expect(render(undefined)).toEqual("");
    expect(render(true as any)).toEqual("");
    expect(render(false as any)).toEqual("");
  });

  test('should render numbers interpolated in JSX elements and arrays', () => {
    const content = render(<>Port: {8080}, Retries: {0}</>);
    expect(content).toEqual("Port: 8080, Retries: 0");

    const arrayContent = render(["Item: ", 1, ", Count: ", 0]);
    expect(arrayContent).toEqual("Item: 1, Count: 0");
  });

  test('should render numbers returned from function and class components', () => {
    function ZeroComponent() {
      return 0 as any;
    }

    function PortComponent() {
      return 8080 as any;
    }

    function BigIntComponent() {
      return BigInt(99) as any;
    }

    class NumberClass extends React.Component {
      render() {
        return 123 as any;
      }
    }

    class ZeroClass extends React.Component {
      render() {
        return 0 as any;
      }
    }

    expect(render(<ZeroComponent />)).toEqual("0");
    expect(render(<PortComponent />)).toEqual("8080");
    expect(render(<BigIntComponent />)).toEqual("99");
    expect(render(<NumberClass />)).toEqual("123");
    expect(render(<ZeroClass />)).toEqual("0");
  });
});
