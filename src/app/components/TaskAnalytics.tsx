'use client'

import * as React from 'react';
import { usePomodoroContext } from '../context/PomodoroContext';

export default function TaskAnalytics() {
    const { state } = usePomodoroContext();

    const stats = React.useMemo(() => {
        const totalTasks = state.tasks.length;
        const completedTasks = state.tasks.filter(t => t.completed).length;
        const totalPomodoros = state.tasks.reduce((acc, t) => acc + t.pomodoros, 0);
        const completedPomodoros = state.tasks.reduce((acc, t) => acc + t.completedPomodoros, 0);

        const categoryStats = state.tasks.reduce((acc, task) => {
            if (task.category) {
                acc[task.category] = (acc[task.category] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const priorityStats = state.tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const productivityScore = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        const estimatedTotalTime = state.tasks.reduce((acc, t) => acc + t.estimatedDuration, 0);
        const completedTime = state.tasks
            .filter(t => t.completed)
            .reduce((acc, t) => acc + t.estimatedDuration, 0);

        return {
            totalTasks,
            completedTasks,
            totalPomodoros,
            completedPomodoros,
            categoryStats,
            priorityStats,
            productivityScore,
            estimatedTotalTime,
            completedTime,
        };
    }, [state.tasks]);

    return (
        <div className='h-full p-6 bg-white rounded-xl border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Task Analytics</h2>

            <div className='grid grid-cols-2 gap-4 mb-4'>
                <div className='p-3 bg-gray-50 rounded-lg'>
                    <div className='text-sm text-gray-500'>Productivity</div>
                    <div className='text-2xl font-bold text-red-500'>{stats.productivityScore}%</div>
                </div>
                <div className='p-3 bg-gray-50 rounded-lg'>
                    <div className='text-sm text-gray-500'>Time Spent</div>
                    <div className='text-2xl font-bold text-gray-800'>
                        {Math.round(stats.completedTime / 60)}h
                    </div>
                </div>
            </div>

            <div className='space-y-4'>
                <div>
                    <h3 className='text-base font-semibold text-gray-700 mb-2'>Priority Distribution</h3>
                    <div className='space-y-1.5'>
                        {Object.entries(stats.priorityStats).map(([priority, count]) => (
                            <div key={priority} className='flex items-center justify-between'>
                                <span className='text-sm capitalize'>{priority}</span>
                                <div className='flex items-center gap-2'>
                                    <div className='w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                                        <div
                                            className={`h-full rounded-full ${priority === 'high'
                                                    ? 'bg-red-500'
                                                    : priority === 'medium'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                }`}
                                            style={{
                                                width: `${(count / stats.totalTasks) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <span className='text-xs text-gray-500 min-w-[20px] text-right'>{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {Object.keys(stats.categoryStats).length > 0 && (
                    <div>
                        <h3 className='text-base font-semibold text-gray-700 mb-2'>Categories</h3>
                        <div className='space-y-1.5'>
                            {Object.entries(stats.categoryStats).map(([category, count]) => (
                                <div key={category} className='flex items-center justify-between'>
                                    <span className='text-sm truncate max-w-[100px]'>{category}</span>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                                            <div
                                                className='h-full bg-blue-500 rounded-full'
                                                style={{
                                                    width: `${(count / stats.totalTasks) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className='text-xs text-gray-500 min-w-[20px] text-right'>{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 