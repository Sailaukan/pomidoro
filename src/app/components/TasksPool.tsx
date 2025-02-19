'use client'

import * as React from 'react';
import { usePomodoroContext } from '../context/PomodoroContext';
import { GiTomato } from 'react-icons/gi';

export default function TasksPool() {
    const { state, dispatch } = usePomodoroContext();
    const [newTaskTitle, setNewTaskTitle] = React.useState('');
    const [newTaskPriority, setNewTaskPriority] = React.useState<'low' | 'medium' | 'high'>('medium');
    const [newTaskCategory, setNewTaskCategory] = React.useState('');
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    const [showNotes, setShowNotes] = React.useState<string | null>(null);
    const [showAddTask, setShowAddTask] = React.useState(false);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            dispatch({
                type: 'ADD_TASK',
                payload: {
                    id: Date.now().toString(),
                    title: newTaskTitle.trim(),
                    completed: false,
                    pomodoros: 1,
                    completedPomodoros: 0,
                    category: newTaskCategory,
                    tags: selectedTags,
                    priority: newTaskPriority,
                    notes: '',
                    createdAt: new Date().toISOString(),
                    estimatedDuration: 25, // Default duration in minutes
                },
            });
            setNewTaskTitle('');
            setNewTaskCategory('');
            setSelectedTags([]);
        }
    };

    const handleUpdateNotes = (taskId: string, notes: string) => {
        dispatch({
            type: 'UPDATE_NOTES',
            payload: { taskId, notes },
        });
    };

    const handleCompleteTask = (taskId: string) => {
        dispatch({ type: 'COMPLETE_TASK', payload: taskId });
    };

    const handleDeleteTask = (taskId: string) => {
        dispatch({ type: 'DELETE_TASK', payload: taskId });
    };

    const handleUpdatePomodoros = (taskId: string, change: number) => {
        const task = state.tasks.find((t) => t.id === taskId);
        if (task) {
            const updatedPomodoros = Math.max(1, task.pomodoros + change);
            dispatch({
                type: 'UPDATE_TASK',
                payload: { ...task, pomodoros: updatedPomodoros },
            });
        }
    };

    return (
        <div className='flex flex-col h-full p-4 bg-white rounded-xl border border-gray-200'>
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>Tasks</h2>
            </div>

            <div className='flex-1 overflow-y-auto space-y-4 mb-4'>
                {state.tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`group p-4 bg-white border rounded-xl transition-all duration-200 
                            hover:shadow-lg hover:border-gray-300
                            ${task.completed ? 'bg-gray-50/50 border-gray-200' : 'border-gray-200'} 
                            ${task.priority === 'high'
                                ? 'border-l-[6px] border-l-red-500'
                                : task.priority === 'medium'
                                    ? 'border-l-[6px] border-l-yellow-500'
                                    : 'border-l-[6px] border-l-green-500'
                            }`}
                    >
                        <div className='flex items-center justify-between mb-3'>
                            <div className='flex items-center gap-3 flex-1'>
                                <div className='relative'>
                                    <input
                                        type='checkbox'
                                        checked={task.completed}
                                        onChange={() => handleCompleteTask(task.id)}
                                        className='w-5 h-5 rounded-md border-2 border-gray-300 text-red-500 
                                            focus:ring-red-500 focus:ring-offset-2 transition-all duration-200
                                            hover:border-red-500 cursor-pointer'
                                    />
                                </div>
                                <span className={`flex-1 font-medium transition-all duration-200
                                    ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                    {task.title}
                                </span>
                            </div>

                            <div className='flex items-center gap-3'>
                                <div className='flex items-center px-2 py-1 bg-gray-50 rounded-lg border border-gray-200 group-hover:border-gray-300 transition-all duration-200'>
                                    <button
                                        onClick={() => handleUpdatePomodoros(task.id, -1)}
                                        className='w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors'
                                    >
                                        -
                                    </button>
                                    <div className='flex items-center gap-1 mx-2 w-[72px] justify-center'>
                                        <GiTomato className="w-4 h-4 text-red-500 flex-none" />
                                        <div className='flex items-center gap-1'>
                                            <span className='font-medium text-sm text-gray-700 w-5 text-center'>
                                                {Math.min(task.completedPomodoros, 99)}
                                            </span>
                                            <span className='text-gray-400'>/</span>
                                            <span className='font-medium text-sm text-gray-500 w-5 text-center'>
                                                {Math.min(task.pomodoros, 99)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUpdatePomodoros(task.id, 1)}
                                        className='w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors'
                                        disabled={task.pomodoros >= 99}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => dispatch({ type: 'SET_ACTIVE_TASK', payload: task.id })}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200
                                        ${state.activeTaskId === task.id
                                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                        }`}
                                    title={state.activeTaskId === task.id ? 'Selected for Focus' : 'Select for Focus'}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>

                                <div className='flex items-center gap-1'>
                                    <button
                                        onClick={() => setShowNotes(showNotes === task.id ? null : task.id)}
                                        className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='pl-8 space-y-2'>
                            {task.category && (
                                <div className='flex items-center gap-2 text-sm text-gray-500'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span className='font-medium text-gray-600'>{task.category}</span>
                                </div>
                            )}

                            {task.tags.length > 0 && (
                                <div className='flex gap-1.5 flex-wrap'>
                                    {task.tags.map((tag, index) => (
                                        <span key={index} className='px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md border border-gray-200'>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {showNotes === task.id && (
                            <div className='mt-3 pl-8'>
                                <textarea
                                    value={task.notes}
                                    onChange={(e) => handleUpdateNotes(task.id, e.target.value)}
                                    placeholder='Add notes...'
                                    className='w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                                        focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 
                                        placeholder-gray-400 resize-none transition-all duration-200'
                                    rows={3}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className='flex-none'>
                {!showAddTask ? (
                    <button
                        onClick={() => setShowAddTask(true)}
                        className='w-full p-3 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors group'
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className='group-hover:scale-110 transition-transform'
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add New Task
                    </button>
                ) : (
                    <form onSubmit={handleAddTask} className='space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200'>
                        <div className='space-y-4'>
                            <input
                                type='text'
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder='What are you working on?'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                autoFocus
                            />
                            <div className='flex gap-2'>
                                <select
                                    value={newTaskPriority}
                                    onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white'
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                                <input
                                    type='text'
                                    value={newTaskCategory}
                                    onChange={(e) => setNewTaskCategory(e.target.value)}
                                    placeholder='Category'
                                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                />
                            </div>
                            <input
                                type='text'
                                placeholder='Add tags (comma-separated)'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                onChange={(e) => setSelectedTags(e.target.value.split(',').map(tag => tag.trim()))}
                            />
                        </div>
                        <div className='flex justify-end gap-2'>
                            <button
                                type='button'
                                onClick={() => setShowAddTask(false)}
                                className='px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                className='px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                            >
                                Add Task
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}