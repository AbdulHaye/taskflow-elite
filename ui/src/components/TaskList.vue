<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="search"
          label="Search Tasks"
          prepend-inner-icon="mdi-magnify"
          class="full-width-input"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filterPriority"
          :items="priorities"
          label="Filter by Priority"
          clearable
          class="full-width-input"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="filterTags"
          :items="allTags"
          label="Filter by Tags"
          multiple
          clearable
          chips
          class="full-width-input"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filterStatus"
          :items="statuses"
          label="Filter by Status"
          clearable
          class="full-width-input"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn color="primary" @click="exportTasks" class="responsive-btn">
          Export Tasks (CSV)
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn color="error" @click="clearAllTasks" class="responsive-btn">
          Clear All Tasks
        </v-btn>
      </v-col>
    </v-row>
    <draggable v-model="filteredTasks" item-key="id" @end="updateTaskOrder">
      <template #item="{ element: task }">
        <v-card
          class="mb-3 task-card"
          :class="[
            `priority-${(task.priority || 'medium').toLowerCase()}`,
            `status-${(task.status || 'to-do')
              .toLowerCase()
              .replace(' ', '-')}`,
          ]"
        >
          <v-card-title class="text-h6">{{ task.title }}</v-card-title>
          <v-card-subtitle class="mt-1">
            {{ task.dueDate.toLocaleDateString() }} |
            {{ task.status || "To Do" }} | {{ task.category || "General" }}
          </v-card-subtitle>
          <v-card-text class="py-2">
            {{ task.description || "No description" }}
            <v-chip
              v-for="tag in task.tags || []"
              :key="tag"
              class="ma-1"
              small
              >{{ tag }}</v-chip
            >
          </v-card-text>
          <v-card-actions class="pa-3">
            <v-select
              v-model="task.status"
              :items="statuses"
              label="Status"
              dense
              outlined
              style="max-width: 150px"
              @update:modelValue="updateTaskStatus(task, $event)"
            />
            <v-spacer />
            <v-btn color="primary" outlined @click="openEditDialog(task)">
              <v-icon left>mdi-pencil</v-icon> Edit
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="confirmDelete(task.id)"
              class="ml-2"
            >
              <v-icon left>mdi-delete</v-icon> Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </draggable>

    <v-dialog v-model="editDialog" max-width="500">
      <v-card class="task-card">
        <v-card-title>Edit Task</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveEditedTask">
            <v-text-field v-model="editedTask.title" label="Title" required />
            <v-textarea v-model="editedTask.description" label="Description" />
            <v-select
              v-model="editedTask.priority"
              :items="priorities"
              label="Priority"
            />
            <v-combobox
              v-model="editedTask.tags"
              :items="allTags"
              label="Tags"
              multiple
              chips
            />
            <v-select
              v-model="editedTask.category"
              :items="categories"
              label="Category"
            />
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="formattedDueDate"
                  label="Due Date"
                  v-bind="props"
                  readonly
                />
              </template>
              <v-date-picker v-model="editedTask.dueDate" />
            </v-menu>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="formattedReminderDate"
                  label="Reminder Date"
                  v-bind="props"
                  readonly
                />
              </template>
              <v-date-picker v-model="editedTask.reminderDate" />
            </v-menu>
            <v-btn type="submit" color="primary">Save</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="task-card">
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this task?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="deleteTaskConfirmed">Delete</v-btn>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import draggable from "vuedraggable";
import { Task, TaskManager, TaskStatus } from "taskflow-core";
import { useTaskStore } from "../store/taskStore";
import { useUserStats } from "../store/userStats";
import { useToast } from "vue-toastification";

const taskStore = useTaskStore();
const userStats = useUserStats();
const toast = useToast();

const search = ref("");
const filterPriority = ref<string | null>(null);
const filterTags = ref<string[]>([]);
const filterStatus = ref<string | null>(null);
const priorities = ["Low", "Medium", "High"];
const statuses = [
  "To Do",
  "In Progress",
  "In Testing",
  "Under Review",
  "Completed",
  "Updatation",
];
const categories = ["General", "Work", "Personal", "Family"];

const editDialog = ref(false);
const editedTask = ref<Task | null>(null);
const deleteDialog = ref(false);
const taskToDelete = ref<string | null>(null);

const allTags = computed(() => {
  const tags = new Set<string>();
  taskStore.tasks.forEach((task) => task.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags);
});

const filteredTasks = computed({
  get() {
    let filtered = taskStore.tasks;
    if (search.value) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(search.value.toLowerCase()) ||
          task.description?.toLowerCase().includes(search.value.toLowerCase())
      );
    }
    if (filterPriority.value) {
      filtered = filtered.filter(
        (task) => task.priority === filterPriority.value
      );
    }
    if (filterTags.value.length) {
      filtered = filtered.filter((task) =>
        task.tags?.some((tag) => filterTags.value.includes(tag))
      );
    }
    if (filterStatus.value) {
      filtered = filtered.filter((task) => task.status === filterStatus.value);
    }
    return filtered;
  },
  set(newValue) {
    taskStore.updateTaskOrder(newValue);
  },
});

const formattedDueDate = computed({
  get() {
    return editedTask.value?.dueDate.toLocaleDateString() || "";
  },
  set(newValue) {
    if (editedTask.value) {
      editedTask.value.dueDate = new Date(newValue);
    }
  },
});

const formattedReminderDate = computed({
  get() {
    return editedTask.value?.reminderDate?.toLocaleDateString() || "";
  },
  set(newValue) {
    if (editedTask.value) {
      editedTask.value.reminderDate = newValue ? new Date(newValue) : undefined;
    }
  },
});

const updateTaskStatus = (task: Task, newStatus: TaskStatus) => {
  taskStore.updateTask(task.id, { status: newStatus });
  if (newStatus === "Completed") {
    userStats.addPoints(10);
    if (userStats.points >= 50 && !userStats.badges.includes("Task Master")) {
      userStats.addBadge("Task Master");
      toast.success("Badge Earned: Task Master!");
    }
  }
  toast.success(`Task status updated to ${newStatus}`);
};

const openEditDialog = (task: Task) => {
  editedTask.value = { ...task };
  editDialog.value = true;
};

const saveEditedTask = () => {
  if (editedTask.value) {
    taskStore.updateTask(editedTask.value.id, {
      title: editedTask.value.title,
      description: editedTask.value.description,
      dueDate: editedTask.value.dueDate,
      priority: editedTask.value.priority,
      tags: editedTask.value.tags,
      category: editedTask.value.category,
      reminderDate: editedTask.value.reminderDate,
    });
    toast.success("Task updated successfully");
    editDialog.value = false;
  }
};

const confirmDelete = (id: string) => {
  taskToDelete.value = id;
  deleteDialog.value = true;
};

const deleteTaskConfirmed = () => {
  if (taskToDelete.value) {
    const success = taskStore.deleteTask(taskToDelete.value);
    if (success) {
      console.log(`Task with ID ${taskToDelete.value} deleted successfully.`);
      toast.success("Task deleted successfully");
    } else {
      console.error(`Failed to delete task with ID ${taskToDelete.value}.`);
      toast.error("Failed to delete task");
    }
  }
  deleteDialog.value = false;
  taskToDelete.value = null;
};

const clearAllTasks = () => {
  localStorage.removeItem("tasks");
  taskStore.tasks = [];
  toast.success("All tasks cleared successfully");
};

const updateTaskOrder = () => {
  taskStore.updateTaskOrder(filteredTasks.value);
};

const exportTasks = () => {
  const manager = new TaskManager();
  const csv = manager.exportTasksToCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tasks_export.csv";
  link.click();
};

onMounted(() => {
  const notifyOverdue = () => {
    taskStore.overdueTasks.forEach((task) => {
      if (Notification.permission === "granted") {
        new Notification(`Task Overdue: ${task.title}`, {
          body: task.description,
        });
      }
    });
  };
  const notifyReminders = () => {
    const manager = new TaskManager();
    manager.getTasksWithReminders().forEach((task) => {
      if (Notification.permission === "granted") {
        new Notification(`Reminder: ${task.title}`, {
          body: `Due on ${task.dueDate.toLocaleDateString()}`,
        });
      }
    });
  };
  Notification.requestPermission();
  setInterval(notifyOverdue, 60000);
  setInterval(notifyReminders, 60000);
});
</script>
