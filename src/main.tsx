import { Component, StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("App render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
          <div className="max-w-lg w-full rounded-2xl bg-white border border-red-200 shadow-xl p-6 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl">!</div>
            <h1 className="mt-4 text-xl font-bold text-slate-800">Приложение не смогло запуститься</h1>
            <p className="mt-2 text-sm text-slate-600">Если после обновления виден белый экран, значит в интерфейсе возникла ошибка.</p>
            {this.state.message && (
              <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-left whitespace-pre-wrap">
                {this.state.message}
              </p>
            )}
            <button
              type="button"
              className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
