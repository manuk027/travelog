import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', background: '#ffebee', color: '#c62828', fontFamily: 'monospace', minHeight: '100vh' }}>
                    <h1>React Rendering Crash Captured 👋</h1>
                    <h2 style={{ color: 'red' }}>{this.state.error && this.state.error.toString()}</h2>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', background: '#ffcdd2', padding: '20px', borderRadius: '8px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Component Stack Trace</summary>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
