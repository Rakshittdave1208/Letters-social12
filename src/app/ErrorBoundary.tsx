import React from "react";

type Props={
  children:React.ReactNode
};

type State={
  hasError:boolean;
};

export default class ErrorBoundary extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center">
          <h1 className="text-xl font-semibold">
            Something went wrong 
          </h1>
          <p>Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}