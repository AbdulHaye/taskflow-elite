import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskManager } from '../src/services/task';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('TaskManager', () => {
  let manager: TaskManager;

  beforeEach(() => {
    manager = new TaskManager();
    localStorage.clear(); 
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset(); 
  });

  it('adds a task with priority and tags', () => {
    const task = manager.addTask('Test Task', new Date(), 'Description', 'High', ['Work']);
    expect(task).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.priority).toBe('High');
    expect(task.tags).toEqual(['Work']);
    expect(manager.getTasks()).toHaveLength(1);
    expect(localStorage.setItem).toHaveBeenCalled(); 
  });

  it('updates a task', () => {
    const task = manager.addTask('Test Task', new Date());
    const updated = manager.updateTask(task.id, { title: 'Updated Task', priority: 'Low' });
    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('Updated Task');
    expect(updated!.priority).toBe('Low');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('deletes a task', () => {
    const task = manager.addTask('Test Task', new Date());
    const deleted = manager.deleteTask(task.id);
    expect(deleted).toBe(true);
    expect(manager.getTasks()).toHaveLength(0);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('filters tasks by tag', () => {
    manager.addTask('Task 1', new Date(), undefined, 'Medium', ['Work']);
    manager.addTask('Task 2', new Date(), undefined, 'Medium', ['Personal']);
    const workTasks = manager.getTasksByTag('Work');
    expect(workTasks).toHaveLength(1);
    expect(workTasks[0].title).toBe('Task 1');
  });
});