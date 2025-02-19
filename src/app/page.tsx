'use client'

import * as React from 'react';
import Timer from './components/Timer';
import TasksPool from './components/TasksPool';
import DailyProgress from './components/DailyProgress';
import TaskAnalytics from './components/TaskAnalytics';
import { PomodoroProvider } from './context/PomodoroContext';

export default function Home() {
  return (
    <PomodoroProvider>
      <main className='min-h-screen bg-gray-50 p-8'>
        <div className='max-w-7xl mx-auto h-[calc(100vh-4rem)]'>
          <div className='grid grid-cols-5 gap-4 h-full'>
            {/* Left column - Tasks (2/5 width) */}
            <div className='col-span-2 h-full'>
              <TasksPool />
            </div>

            {/* Right column - Timer and Analytics (3/5 width) */}
            <div className='col-span-3 flex flex-col gap-2 h-full'>
              <div className='flex-none'>
                <Timer />
              </div>
              <div className='flex-1 grid grid-cols-2 gap-2 min-h-0'>
                <DailyProgress />
                <TaskAnalytics />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PomodoroProvider>
  );
}
