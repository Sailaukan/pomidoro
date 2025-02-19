'use client'

import * as React from 'react';
import { usePomodoroContext } from '../context/PomodoroContext';

export default function Timer() {
    const { state, dispatch } = usePomodoroContext();
    const { timer, settings } = state;

    React.useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timer.isRunning && timer.timeLeft > 0) {
            interval = setInterval(() => {
                dispatch({ type: 'SET_TIME_LEFT', payload: timer.timeLeft - 1 });
            }, 1000);
        } else if (timer.timeLeft === 0 && timer.isRunning) {
            dispatch({ type: 'PAUSE_TIMER' });
            if (timer.currentMode === 'work') {
                dispatch({ type: 'INCREMENT_DAILY_POMODOROS' });
                const nextMode = (state.statistics.dailyPomodoros % settings.longBreakInterval === 0)
                    ? 'longBreak'
                    : 'shortBreak';
                dispatch({ type: 'CHANGE_MODE', payload: nextMode });
            } else {
                dispatch({ type: 'CHANGE_MODE', payload: 'work' });
            }
        }

        return () => clearInterval(interval);
    }, [timer.isRunning, timer.timeLeft, timer.currentMode, settings.longBreakInterval, state.statistics.dailyPomodoros, dispatch]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleStartPause = () => {
        if (timer.isRunning) {
            dispatch({ type: 'PAUSE_TIMER' });
        } else {
            dispatch({ type: 'START_TIMER', payload: timer.timeLeft });
        }
    };

    const handleReset = () => {
        dispatch({ type: 'RESET_TIMER' });
    };

    const handleModeChange = (mode: 'work' | 'shortBreak' | 'longBreak') => {
        dispatch({ type: 'CHANGE_MODE', payload: mode });
    };

    return (
        <div className='flex flex-col items-center justify-center p-12 rounded-xl bg-white border border-gray-200 min-h-[400px]'>
            <div className='w-full max-w-2xl flex flex-col items-center justify-center gap-8'>
                <div className='flex gap-4'>
                    <button
                        onClick={() => handleModeChange('work')}
                        className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${timer.currentMode === 'work'
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Pomodoro
                    </button>
                    <button
                        onClick={() => handleModeChange('shortBreak')}
                        className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${timer.currentMode === 'shortBreak'
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Short Break
                    </button>
                    <button
                        onClick={() => handleModeChange('longBreak')}
                        className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${timer.currentMode === 'longBreak'
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Long Break
                    </button>
                </div>

                <div className='text-8xl font-bold text-gray-800 tabular-nums'>
                    {formatTime(timer.timeLeft)}
                </div>

                <div className='flex items-center gap-6'>
                    <button
                        onClick={handleStartPause}
                        className={`px-12 py-4 rounded-full text-xl font-semibold transition-all duration-200 ${timer.isRunning
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                            }`}
                    >
                        {timer.isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                        onClick={handleReset}
                        className='p-4 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500 transition-all duration-200'
                        title="Reset Timer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}