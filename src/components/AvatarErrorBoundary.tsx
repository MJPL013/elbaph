import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  resetKey: number;
  onError: () => void;
};

type State = { failed: boolean };

export class AvatarErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  componentDidUpdate(previous: Props) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
