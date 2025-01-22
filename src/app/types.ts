export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  assignees: {
    id: string;
    avatar: string;
  }[];
  subtasks: { id: string; title: string; completed: boolean; }[];
  activities: Activity[];
  comments?: Comment[];
};

export type Activity = {
  id: string;
  type: 'status_change' | 'priority_change' | 'assignee_change' | 'comment_added';
  message: string;
  timestamp: string;
  userId: string;
  userName: string;
  details?: {
    oldStatus?: Task['status'];
    newStatus?: Task['status'];
    comment?: string;
  };
};

export type Comment = {
  id: string;
  text: string;
  userId: string;
  timestamp: string;
}; 