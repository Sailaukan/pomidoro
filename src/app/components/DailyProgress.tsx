'use client'

import * as React from 'react';
import { usePomodoroContext } from '../context/PomodoroContext';

export default function DailyProgress() {
    const { state } = usePomodoroContext();
    const { statistics } = state;

    return (
        <div className='h-full p-6 bg-white rounded-xl border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Daily Progress</h2>

            <div className='grid grid-cols-2 gap-4'>
                <div className='p-4 bg-gray-50 rounded-lg'>
                    <div className='text-sm text-gray-600 mb-1'>Completed Pomodoros</div>
                    <div className='text-2xl font-bold text-red-500'>{statistics.dailyPomodoros}</div>
                </div>

                <div className='p-4 bg-gray-50 rounded-lg'>
                    <div className='text-sm text-gray-600 mb-1'>Completed Tasks</div>
                    <div className='text-2xl font-bold text-green-500'>{statistics.completedTasks}</div>
                </div>
            </div>

            <div className='mt-4'>
                <h3 className='text-base font-semibold text-gray-700 mb-2'>Focus Time</h3>
                <div className='text-xl font-bold text-gray-800'>
                    {Math.floor(statistics.dailyPomodoros * 25)} minutes
                </div>
            </div>
        </div>
    );
}