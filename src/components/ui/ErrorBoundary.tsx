import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * 
 * Features:
 * - Catches JavaScript errors in the component tree
 * - Displays fallback UI with error details
 * - Provides refresh functionality
 * - Logs errors for debugging
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  private handleRefresh = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-blue-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 text-center border border-white border-opacity-20">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-300">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-20 rounded-lg border border-red-400 text-left">
                <p className="text-red-200 text-sm font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <Button
              onClick={this.handleRefresh}
              variant="primary"
              className="w-full"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;