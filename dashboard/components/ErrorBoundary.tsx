'use client';

import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[CrimeIntel ErrorBoundary]', {
      errorId: this.state.errorId,
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="bg-ci-card border border-red-500/30 rounded-xl p-8 max-w-lg w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Errore di Sistema</h2>
            <p className="text-ci-muted text-sm mb-4">
              Si è verificato un errore imprevisto. L&apos;evento è stato registrato.
            </p>
            <div className="bg-ci-bg rounded-lg p-3 mb-4 text-left">
              <p className="text-xs text-ci-muted mb-1">Error ID</p>
              <code className="text-xs text-red-400 font-mono">{this.state.errorId}</code>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <>
                  <p className="text-xs text-ci-muted mt-2 mb-1">Message</p>
                  <code className="text-xs text-orange-400 font-mono break-all">
                    {this.state.error.message}
                  </code>
                </>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-ci-accent text-white rounded-lg text-sm font-medium hover:bg-ci-accent/80 transition"
              >
                Riprova
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-ci-card border border-ci-border text-ci-text rounded-lg text-sm font-medium hover:bg-ci-bg transition"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
