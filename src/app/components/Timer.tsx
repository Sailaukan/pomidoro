'use client'

import * as React from 'react';
import { usePomodoroContext } from '../context/PomodoroContext';
import { GiTomato } from 'react-icons/gi';

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
                if (state.activeTaskId) {
                    dispatch({ type: 'INCREMENT_TASK_POMODORO', payload: state.activeTaskId });
                }
                const nextMode = (state.statistics.dailyPomodoros % settings.longBreakInterval === 0)
                    ? 'longBreak'
                    : 'shortBreak';
                dispatch({ type: 'CHANGE_MODE', payload: nextMode });
            } else {
                dispatch({ type: 'CHANGE_MODE', payload: 'work' });
            }
        }

        return () => clearInterval(interval);
    }, [timer.isRunning, timer.timeLeft, timer.currentMode, settings.longBreakInterval, state.statistics.dailyPomodoros, state.activeTaskId, dispatch]);

    // Get active task
    const activeTask = React.useMemo(() => {
        return state.activeTaskId ? state.tasks.find(t => t.id === state.activeTaskId) : null;
    }, [state.activeTaskId, state.tasks]);

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

    const getProgressPercentage = () => {
        const totalTime = timer.currentMode === 'work'
            ? settings.workDuration
            : timer.currentMode === 'shortBreak'
                ? settings.shortBreakDuration
                : settings.longBreakDuration;
        return ((totalTime - timer.timeLeft) / totalTime) * 100;
    };

    const getModeColor = () => {
        switch (timer.currentMode) {
            case 'work':
                return 'from-red-500 to-red-600';
            case 'shortBreak':
                return 'from-green-500 to-green-600';
            case 'longBreak':
                return 'from-blue-500 to-blue-600';
        }
    };

    const getModeAccentColor = () => {
        switch (timer.currentMode) {
            case 'work':
                return 'bg-red-500 hover:bg-red-600 ring-red-200';
            case 'shortBreak':
                return 'bg-green-500 hover:bg-green-600 ring-green-200';
            case 'longBreak':
                return 'bg-blue-500 hover:bg-blue-600 ring-blue-200';
        }
    };

    return (
        <div className='relative flex flex-col items-center justify-start p-4 rounded-xl bg-white border border-gray-200 min-h-[400px] overflow-hidden'>
            {/* Progress Ring Background */}
            <div
                className='absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100'
                style={{
                    clipPath: `circle(${getProgressPercentage()}% at 50% 50%)`
                }}
            />

            <div className='relative w-full max-w-2xl flex flex-col items-center gap-6 z-10'>
                {/* Mode Selection Tabs */}
                <div className='w-full flex gap-2 p-1 bg-gray-100 rounded-xl'>
                    <button
                        onClick={() => handleModeChange('work')}
                        className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${timer.currentMode === 'work'
                            ? 'bg-white text-gray-800 shadow-sm scale-100'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Pomodoro
                    </button>
                    <button
                        onClick={() => handleModeChange('shortBreak')}
                        className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${timer.currentMode === 'shortBreak'
                            ? 'bg-white text-gray-800 shadow-sm scale-100'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Short Break
                    </button>
                    <button
                        onClick={() => handleModeChange('longBreak')}
                        className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${timer.currentMode === 'longBreak'
                            ? 'bg-white text-gray-800 shadow-sm scale-100'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Long Break
                    </button>
                </div>

                {/* Active Task Display */}
                {activeTask && (
                    <div className='w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className={`w-2 h-10 rounded-full ${activeTask.priority === 'high'
                                    ? 'bg-red-500'
                                    : activeTask.priority === 'medium'
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                    }`} />
                                <div>
                                    <div className='text-sm font-medium text-gray-500'>Current Focus</div>
                                    <div className='text-lg font-medium text-gray-800 line-clamp-1'>{activeTask.title}</div>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200'>
                                    <GiTomato className="w-4 h-4 text-red-500" />
                                    <div className='flex items-center gap-1'>
                                        <span className='font-medium text-sm text-gray-700 w-5 text-center'>{Math.min(activeTask.completedPomodoros, 99)}</span>
                                        <span className='text-gray-400'>/</span>
                                        <span className='font-medium text-sm text-gray-500 w-5 text-center'>{Math.min(activeTask.pomodoros, 99)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => dispatch({ type: 'SET_ACTIVE_TASK', payload: null })}
                                    className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 
                                        hover:bg-red-50 rounded-lg transition-colors'
                                    title="Unselect Task"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Timer Display */}
                <div className='relative mt-4'>
                    <div className='text-8xl font-bold text-gray-800 tabular-nums tracking-tight'>
                        {formatTime(timer.timeLeft)}
                    </div>
                    <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-500'>
                        {timer.currentMode !== 'work' ? 'Break Time' : 'Focus Time'}
                    </div>
                </div>

                {/* Control Buttons */}
                <div className='flex items-center gap-4 mt-8'>
                    <button
                        onClick={handleStartPause}
                        className={`
                            px-12 py-4 rounded-full text-lg font-semibold text-white
                            transition-all duration-300 transform hover:scale-105
                            ring-4 ring-opacity-50
                            ${timer.isRunning
                                ? 'bg-gray-800 hover:bg-gray-900 ring-gray-200'
                                : getModeAccentColor()
                            }
                        `}
                    >
                        {timer.isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                        onClick={handleReset}
                        className='p-4 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 
                                 transition-all duration-300 transform hover:scale-105'
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