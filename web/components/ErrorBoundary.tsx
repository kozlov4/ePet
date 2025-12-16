import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            Щось пішло не так
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Вибачте за незручності. Сталася помилка при
                            завантаженні сторінки.
                        </p>
                        {this.state.error && (
                            <details className="mb-4">
                                <summary className="cursor-pointer text-sm text-gray-600 mb-2">
                                    Деталі помилки
                                </summary>
                                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.href = '/home';
                            }}
                            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Повернутися на головну
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
