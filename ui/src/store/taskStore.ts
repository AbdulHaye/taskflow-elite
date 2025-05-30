import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Task, TaskManager, TaskStatus } from 'taskflow-core';

export const useTaskStore = defineStore('task', () => {
  const manager = new TaskManager();
  const tasks = ref<Task[]>(manager.getTasks());

  const addTask = (
    title: string,
    dueDate: Date,
    description?: string,
    priority: 'Low' | 'Medium' | 'High' = 'Medium',
    tags: string[] = [],
    status: TaskStatus = 'To Do',
    category: string = 'General',
    reminderDate?: Date
  ) => {
    manager.addTask(title, dueDate, description, priority, tags, undefined, status, category, reminderDate);
    tasks.value = manager.getTasks();
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    manager.updateTask(id, updates);
    tasks.value = manager.getTasks();
  };

  const deleteTask = (id: string): boolean => {
    const success = manager.deleteTask(id);
    tasks.value = manager.getTasks();
    return success;
  };

  const updateTaskOrder = (newOrder: Task[]) => {
    manager.updateTaskOrder(newOrder);
    tasks.value = manager.getTasks();
  };

  const overdueTasks = computed(() => manager.getOverdueTasks());

  return { tasks, addTask, updateTask, deleteTask, updateTaskOrder, overdueTasks };
});