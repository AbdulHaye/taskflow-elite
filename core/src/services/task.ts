export type TaskStatus = 'To Do' | 'In Progress' | 'In Testing' | 'Under Review' | 'Completed' | 'Updatation';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  priority?: 'Low' | 'Medium' | 'High';
  tags?: string[];
  order?: number;
  status: TaskStatus;
  category?: string;
  reminderDate?: Date;
}

export class TaskManager {
  private tasks: Task[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const parsedTasks = JSON.parse(saved, (key, value) =>
        key === 'dueDate' || key === 'reminderDate' ? new Date(value) : value
      );
      this.tasks = parsedTasks.map((task: any) => ({
        id: task.id || crypto.randomUUID(),
        title: task.title || 'Untitled Task',
        description: task.description,
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        completed: task.completed ?? false,
        priority: task.priority || 'Medium',
        tags: task.tags || [],
        order: task.order ?? 0,
        status: task.status || 'To Do',
        category: task.category || 'General',
        reminderDate: task.reminderDate ? new Date(task.reminderDate) : undefined,
      }));
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(
    title: string,
    dueDate: Date,
    description?: string,
    priority: 'Low' | 'Medium' | 'High' = 'Medium',
    tags: string[] = [],
    order?: number,
    status: TaskStatus = 'To Do',
    category: string = 'General',
    reminderDate?: Date
  ): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      dueDate,
      completed: false,
      priority,
      tags,
      order: order ?? this.tasks.length,
      status,
      category,
      reminderDate,
    };
    this.tasks.push(task);
    this.saveToStorage();
    return task;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Task | null {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    Object.assign(task, updates);
    this.saveToStorage();
    return task;
  }

  updateTaskOrder(newOrder: Task[]) {
    this.tasks = newOrder;
    this.tasks.forEach((task, index) => {
      task.order = index;
    });
    this.saveToStorage();
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      console.error(`Task with ID ${id} not found for deletion.`);
      return false;
    }
    this.tasks.splice(index, 1);
    this.saveToStorage();
    console.log(`Task with ID ${id} deleted. Remaining tasks:`, this.tasks);
    return true;
  }

  getTasks(): Task[] {
    this.tasks.forEach(task => {
      if (!task.status) {
        console.warn(`Task with ID ${task.id} is missing 'status' field:`, task);
      }
    });
    return [...this.tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  getTasksByTag(tag: string): Task[] {
    return this.tasks.filter(task => task.tags?.includes(tag));
  }

  getTasksByCategory(category: string): Task[] {
    return this.tasks.filter(task => task.category === category);
  }

  getOverdueTasks(): Task[] {
    const now = new Date();
    return this.tasks.filter(task => !task.completed && task.dueDate < now);
  }

  getTasksWithReminders(): Task[] {
    const now = new Date();
    return this.tasks.filter(task => task.reminderDate && task.reminderDate <= now && !task.completed);
  }

  exportTasksToCSV(): string {
    const headers = ['ID', 'Title', 'Description', 'Due Date', 'Status', 'Priority', 'Category', 'Tags'];
    const rows = this.tasks.map(task => [
      task.id,
      `"${task.title.replace(/"/g, '""')}"`,
      `"${task.description?.replace(/"/g, '""') || ''}"`,
      task.dueDate.toISOString(),
      task.status,
      task.priority ?? 'Medium',
      task.category ?? 'General',
      task.tags?.join(';') || '',
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}