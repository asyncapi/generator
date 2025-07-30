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
});
