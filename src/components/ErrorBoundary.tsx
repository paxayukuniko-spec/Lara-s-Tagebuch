import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, BookOpen } from 'lucide-react';
import diaryBg from '../assets/images/startseite_hero_1790788872670.jpg';

interface Props {
  children: ReactNode;
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
    console.error('ErrorBoundary abgefangen:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('laras_tagebuch_db_v6');
      localStorage.removeItem('laras_tagebuch_db_v5');
      localStorage.removeItem('laras_tagebuch_db_v4');
      localStorage.removeItem('laras_tagebuch_db_v3');
      localStorage.removeItem('laras_tagebuch_db_v2');
      localStorage.removeItem('laras_tagebuch_db_v1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#0d0907] text-[#e8d7be] font-serif select-none">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src={diaryBg}
              alt="Hintergrund"
              className="w-full h-full object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-[#0d0907]/80" />
          </div>

          <div className="relative z-10 max-w-lg w-full bg-[#1b120c] border-2 border-[#8b5a2b] rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-[#8b1e1e]/20 border border-[#8b1e1e] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-[#e4a860]" />
            </div>

            <h1 className="text-2xl font-cinzel font-bold text-[#ffd992] mb-2">
              Lara´s Tagebuch – Wiederherstellung
            </h1>

            <p className="text-sm font-serif text-[#d6c4ae] mb-6">
              Ein unerwarteter Lesefehler ist aufgetreten. Die Seite kann sofort neu geladen und die Standard-Tagebucheinträge wiederhergestellt werden.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2e1d14] border border-[#8b5a2b] text-[#ffd992] hover:bg-[#3d2719] text-xs font-cinzel font-bold transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Seite neu laden</span>
              </button>

              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8b5a2b] text-white hover:bg-[#a66b33] text-xs font-cinzel font-bold transition cursor-pointer shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                <span>Tagebuch zurücksetzen</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
