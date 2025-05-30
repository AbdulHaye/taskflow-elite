import type { Task } from './task';

export function getCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length; 
  return Math.round((completed / tasks.length) * 100);
}

export function getPriorityBreakdown(tasks: Task[]): Record<string, number> {
  return tasks.reduce(
    (acc, task) => {
      const priority = task.priority ?? 'Medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    },
    { Low: 0, Medium: 0, High: 0 }
  );
}

export function getTagUsage(tasks: Task[]): Record<string, number> {
  return tasks.reduce((acc, task) => {
    task.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
}

export function getStatusBreakdown(tasks: Task[]): Record<string, number> {
  return tasks.reduce(
    (acc, task) => {
      const status = task.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {
      'To Do': 0,
      'In Progress': 0,
      'In Testing': 0,
      'Under Review': 0,
      'Completed': 0,
      'Updatation': 0,
    }
  );
}

export function getCategoryBreakdown(tasks: Task[]): Record<string, number> {
  return tasks.reduce(
    (acc, task) => {
      const category = task.category ?? 'General';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    { General: 0 }
  );
}

export function suggestTaskPriority(task: Task): 'Low' | 'Medium' | 'High' {
  const now = new Date();
  const timeDiff = task.dueDate.getTime() - now.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  if (daysDiff <= 1 || task.status === 'In Testing' || task.status === 'Under Review') return 'High';
  if (daysDiff <= 3 || task.status === 'In Progress') return 'Medium';
  return 'Low';
}