/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Component, type ReactNode } from "react";

interface Props {
  name: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{ color: "#ef5350", padding: "12px", fontFamily: "monospace", fontSize: "12px" }}
        >
          <strong>[cert-manager] {this.props.name} crashed:</strong>
          <br />
          {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}
