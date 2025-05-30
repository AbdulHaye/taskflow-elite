import { describe, it, expect } from 'vitest';
import { getCompletionRate, getPriorityBreakdown, getTagUsage } from '../src/services/analytics';
import { Task } from '../src/services/task';

describe('Analytics', () => {
  it('calculates completion rate', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', dueDate: new Date(), completed: true },
      { id: '2', title: 'Task 2', dueDate: new Date(), completed: false },
    ];
    const rate = getCompletionRate(tasks);
    expect(rate).toBe(50);
  });

  it('handles empty task list', () => {
    const rate = getCompletionRate([]);
    expect(rate).toBe(0);
  });

  it('calculates priority breakdown', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', dueDate: new Date(), completed: false, priority: 'High' },
      { id: '2', title: 'Task 2', dueDate: new Date(), completed: false, priority: 'Medium' },
      { id: '3', title: 'Task 3', dueDate: new Date(), completed: false, priority: 'Low' },
    ];
    const breakdown = getPriorityBreakdown(tasks);
    expect(breakdown).toEqual({ Low: 1, Medium: 1, High: 1 });
  });

  it('calculates tag usage', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', dueDate: new Date(), completed: false, tags: ['Work', 'Urgent'] },
      { id: '2', title: 'Task 2', dueDate: new Date(), completed: false, tags: ['Work', 'Personal'] },
    ];
    const usage = getTagUsage(tasks);
    expect(usage).toEqual({ Work: 2, Urgent: 1, Personal: 1 });
  });
});