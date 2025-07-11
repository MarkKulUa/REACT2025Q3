import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #f5c6cb',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            margin: '20px',
          }}
        >
          <h2>Something went wrong!</h2>
          <p>An error occurred in the application.</p>
          <details
            style={{
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              marginTop: '10px',
            }}
          >
            {this.state.error && this.state.error.toString()}
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
