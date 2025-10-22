import React, { useState } from 'react';
import type { PomodoroTask } from '../types/timer-types';

interface KanbanBoardProps {
  tasks: PomodoroTask[];
  onAddTask: (text: string) => void;
  onMoveTask: (taskId: string, newStatus: PomodoroTask['status']) => void;
  onDeleteTask: (taskId: string) => void;
}

export function KanbanBoard({ tasks, onAddTask, onMoveTask, onDeleteTask }: Readonly<KanbanBoardProps>) {
  const [newTaskText, setNewTaskText] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
      setShowInput(false);
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'inProgress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h2>Tasks</h2>
      </div>

      <div className="kanban-columns">
        {/* To Do Column */}
        <div className="kanban-column">
          <h3 className="kanban-column-title">To Do</h3>
          <div className="kanban-tasks">
            {todoTasks.map(task => (
              <div key={task.id} className="kanban-task">
                <span className="kanban-task-text">{task.text}</span>
                <div className="kanban-task-actions">
                  <button
                    type="button"
                    onClick={() => onMoveTask(task.id, 'inProgress')}
                    className="kanban-btn kanban-btn-start"
                    title="Start"
                  >
                    ▶
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="kanban-btn kanban-btn-delete"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {showInput ? (
              <div className="kanban-add-input">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTask();
                    if (e.key === 'Escape') { setShowInput(false); setNewTaskText(''); }
                  }}
                  placeholder="Task description..."
                  autoFocus
                />
                <div className="kanban-add-actions">
                  <button type="button" onClick={handleAddTask} className="kanban-btn kanban-btn-confirm">Add</button>
                  <button type="button" onClick={() => { setShowInput(false); setNewTaskText(''); }} className="kanban-btn kanban-btn-cancel">Cancel</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setShowInput(true)} className="kanban-add-btn">
                + Add Task
              </button>
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="kanban-column">
          <h3 className="kanban-column-title">In Progress</h3>
          <div className="kanban-tasks">
            {inProgressTasks.map(task => (
              <div key={task.id} className="kanban-task">
                <span className="kanban-task-text">{task.text}</span>
                <div className="kanban-task-actions">
                  <button
                    type="button"
                    onClick={() => onMoveTask(task.id, 'todo')}
                    className="kanban-btn kanban-btn-back"
                    title="Back to To Do"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveTask(task.id, 'done')}
                    className="kanban-btn kanban-btn-done"
                    title="Complete"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="kanban-btn kanban-btn-delete"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="kanban-column">
          <h3 className="kanban-column-title">Done</h3>
          <div className="kanban-tasks">
            {doneTasks.map(task => (
              <div key={task.id} className="kanban-task kanban-task-done">
                <span className="kanban-task-text">{task.text}</span>
                <div className="kanban-task-actions">
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="kanban-btn kanban-btn-delete"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
