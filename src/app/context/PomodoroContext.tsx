import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    pomodoros: number;
    completedPomodoros: number;
    category?: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high';
    notes: string;
    subtasks: { id: string; title: string; completed: boolean }[];
    dueDate?: string;
    createdAt: string;
    estimatedDuration: number;
}

type TimerState = {
    isRunning: boolean;
    timeLeft: number;
    currentMode: 'work' | 'shortBreak' | 'longBreak';
};

type PomodoroState = {
    timer: TimerState;
    tasks: Task[];
    settings: {
        workDuration: number;
        shortBreakDuration: number;
        longBreakDuration: number;
        longBreakInterval: number;
    };
    statistics: {
        dailyPomodoros: number;
        completedTasks: number;
    };
};

export type PomodoroAction =
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: string }
    | { type: 'COMPLETE_TASK'; payload: string }
    | { type: 'ADD_SUBTASK'; payload: { taskId: string; subtask: { id: string; title: string; completed: boolean } } }
    | { type: 'UPDATE_SUBTASK'; payload: { taskId: string; subtaskId: string; completed: boolean } }
    | { type: 'UPDATE_TAGS'; payload: { taskId: string; tags: string[] } }
    | { type: 'UPDATE_PRIORITY'; payload: { taskId: string; priority: 'low' | 'medium' | 'high' } }
    | { type: 'UPDATE_NOTES'; payload: { taskId: string; notes: string } }
    | { type: 'SET_DUE_DATE'; payload: { taskId: string; dueDate: string } }
    | { type: 'START_TIMER'; payload: number }
    | { type: 'STOP_TIMER' }
    | { type: 'RESET_TIMER' }
    | { type: 'TICK' }
    | { type: 'SET_TIME_LEFT'; payload: number }
    | { type: 'PAUSE_TIMER' }
    | { type: 'INCREMENT_DAILY_POMODOROS' }
    | { type: 'CHANGE_MODE'; payload: 'work' | 'shortBreak' | 'longBreak' };

const initialState: PomodoroState = {
    timer: {
        isRunning: false,
        timeLeft: 25 * 60, // 25 minutes in seconds
        currentMode: 'work',
    },
    tasks: [],
    settings: {
        workDuration: 25 * 60,
        shortBreakDuration: 5 * 60,
        longBreakDuration: 15 * 60,
        longBreakInterval: 4,
    },
    statistics: {
        dailyPomodoros: 0,
        completedTasks: 0,
    },
};

function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
    switch (action.type) {
        case 'START_TIMER':
            return {
                ...state,
                timer: { ...state.timer, isRunning: true },
            };
        case 'PAUSE_TIMER':
            return {
                ...state,
                timer: { ...state.timer, isRunning: false },
            };
        case 'RESET_TIMER':
            return {
                ...state,
                timer: {
                    ...state.timer,
                    isRunning: false,
                    timeLeft: state.settings.workDuration,
                },
            };
        case 'SET_TIME_LEFT':
            return {
                ...state,
                timer: { ...state.timer, timeLeft: action.payload },
            };
        case 'ADD_TASK':
            return {
                ...state,
                tasks: [...state.tasks, action.payload],
            };
        case 'COMPLETE_TASK':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload
                        ? { ...task, completed: true }
                        : task
                ),
                statistics: {
                    ...state.statistics,
                    completedTasks: state.statistics.completedTasks + 1,
                },
            };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                ),
            };
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.payload),
            };
        case 'INCREMENT_DAILY_POMODOROS':
            return {
                ...state,
                statistics: {
                    ...state.statistics,
                    dailyPomodoros: state.statistics.dailyPomodoros + 1,
                },
            };
        case 'CHANGE_MODE':
            const newTimeLeft = action.payload === 'work'
                ? state.settings.workDuration
                : action.payload === 'shortBreak'
                    ? state.settings.shortBreakDuration
                    : state.settings.longBreakDuration;
            return {
                ...state,
                timer: {
                    ...state.timer,
                    currentMode: action.payload,
                    timeLeft: newTimeLeft,
                    isRunning: false,
                },
            };
        case 'ADD_SUBTASK':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.taskId
                        ? { ...task, subtasks: [...task.subtasks, action.payload.subtask] }
                        : task
                ),
            };
        case 'UPDATE_SUBTASK':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.taskId
                        ? {
                            ...task,
                            subtasks: task.subtasks.map(subtask =>
                                subtask.id === action.payload.subtaskId
                                    ? { ...subtask, completed: action.payload.completed }
                                    : subtask
                            ),
                        }
                        : task
                ),
            };
        case 'UPDATE_TAGS':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.taskId
                        ? { ...task, tags: action.payload.tags }
                        : task
                ),
            };
        case 'UPDATE_PRIORITY':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.taskId
                        ? { ...task, priority: action.payload.priority }
                        : task
                ),
            };
        case 'UPDATE_NOTES':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.taskId
                        ? { ...task, notes: action.payload.notes }
                        : task
                ),
            };
        case 'SET_DUE_DATE':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.taskId
                        ? { ...task, dueDate: action.payload.dueDate }
                        : task
                ),
            };
        case 'TICK':
            return {
                ...state,
                timer: { ...state.timer, timeLeft: state.timer.timeLeft - 1 },
            };
        default:
            return state;
    }
}

const PomodoroContext = createContext<{
    state: PomodoroState;
    dispatch: React.Dispatch<PomodoroAction>;
} | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(pomodoroReducer, initialState);

    return (
        <PomodoroContext.Provider value={{ state, dispatch }}>
            {children}
        </PomodoroContext.Provider>
    );
}

export function usePomodoroContext() {
    const context = useContext(PomodoroContext);
    if (context === undefined) {
        throw new Error('usePomodoroContext must be used within a PomodoroProvider');
    }
    return context;
} 