import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#091428] text-[#C8AA6E] p-4">
          <div className="max-w-2xl bg-[#0A1428] border border-red-500 p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Something went wrong.</h1>
            <p className="mb-4">The application encountered an unexpected error.</p>
            <details className="whitespace-pre-wrap bg-black/50 p-4 rounded text-sm font-mono text-red-300">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 px-4 py-2 bg-[#C8AA6E] text-[#091428] font-bold rounded hover:bg-[#F0E6D2] transition-colors"
            >
                Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
