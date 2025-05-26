# Example: Building a Todo Card

This example shows how to create a fully functional Todo List card for SwipeOS.

## 1. Create the Card

```bash
node card-development-kit/tools/create-card.js

# When prompted:
# Card name: Todo List
# Description: A simple todo list manager
# Author: Your Name
# Category: productivity
# Up swipe: Add Task
# Down swipe: Settings
# Left swipe: History
# Right swipe: Share
```

## 2. Customize the Card Front (components/CardFront.tsx)

```tsx
import React from 'react';
import { CardConfig } from './types';

interface CardFrontProps {
  config: CardConfig;
  isDark?: boolean;
  data?: any;
}

const CardFront: React.FC<CardFrontProps> = ({ config, isDark = false, data }) => {
  // Load todos from localStorage
  const todos = JSON.parse(localStorage.getItem(`${config.id}_todos`) || '[]');
  const completedCount = todos.filter((t: any) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="w-full h-full p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">Todo List</h3>
          <p className="text-sm opacity-70">
            {completedCount} of {totalCount} completed
          </p>
        </div>
        <div className="text-2xl">📝</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
        <div 
          className="h-full rounded-full transition-all"
          style={{ 
            width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
            backgroundColor: config.theme.primary 
          }}
        />
      </div>

      {/* Recent Todos Preview */}
      <div className="flex-1 space-y-1">
        {todos.slice(0, 3).map((todo: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <span className={todo.completed ? 'line-through opacity-50' : ''}>
              {todo.completed ? '✓' : '○'} {todo.title}
            </span>
          </div>
        ))}
        {todos.length > 3 && (
          <div className="text-xs opacity-50">
            +{todos.length - 3} more tasks
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs opacity-50 text-center mt-2">
        Swipe up to add task
      </div>
    </div>
  );
};

export default CardFront;
```

## 3. Implement Add Task Function (functions/upSwipe.ts)

```typescript
import { SwipeFunctionProps } from '../components/types';

export const upSwipe = async (props: SwipeFunctionProps): Promise<any> => {
  const { config } = props;

  try {
    // This function prepares data for the popup
    const todos = JSON.parse(localStorage.getItem(`${config.id}_todos`) || '[]');
    
    return {
      success: true,
      action: 'add-task',
      data: {
        currentTodos: todos,
        categories: ['Personal', 'Work', 'Shopping', 'Other']
      },
      message: 'Opening add task dialog'
    };
  } catch (error) {
    return {
      success: false,
      action: 'add-task',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to open add task'
    };
  }
};
```

## 4. Create Add Task Popup (popups/UpPopup.tsx)

```tsx
import React, { useState } from 'react';
import { PopupProps } from '../components/types';

const UpPopup: React.FC<PopupProps> = ({ config, isDark = false, onClose, data }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Personal');
  const [taskPriority, setTaskPriority] = useState('medium');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskTitle.trim()) return;

    // Create new task
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      category: taskCategory,
      priority: taskPriority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const todos = JSON.parse(localStorage.getItem(`${config.id}_todos`) || '[]');
    todos.unshift(newTask);
    localStorage.setItem(`${config.id}_todos`, JSON.stringify(todos));

    // Close popup
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Title</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter task title"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <div className="flex space-x-2">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setTaskPriority(priority)}
                  className={`flex-1 py-1 px-3 rounded-full text-sm capitalize ${
                    taskPriority === priority 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpPopup;
```

## 5. Test the Card

```bash
node card-development-kit/tools/test-card.js todo-list
```

## 6. Package for Distribution

```bash
node card-development-kit/tools/package-card.js todo-list
```

## Key Concepts Demonstrated

1. **Data Persistence**: Using localStorage to save todos
2. **State Management**: Managing form state in popups
3. **Theme Integration**: Using config.theme colors
4. **Responsive Design**: Works on all screen sizes
5. **User Feedback**: Progress bars and counters
6. **Clean Architecture**: Separation of concerns (L1, L2, L3)

## Next Steps

- Add todo completion toggles in the History popup
- Implement sharing via QR code in the Share popup
- Add settings for theme and notifications
- Create categories and filters
- Add due dates and reminders 