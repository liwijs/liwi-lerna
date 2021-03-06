import type { ReactElement, FormEventHandler } from 'react';
import React, { useState, useContext, useEffect } from 'react';
import { useOperation, TransportClientReadyContext } from 'react-liwi';
import { TodoServicesContext } from 'web/todo/services/TodoServicesProvider';

export function NewTaskForm(): ReactElement {
  const [newTaskInput, setNewTaskInput] = useState('');
  const todoServices = useContext(TodoServicesContext);
  const isReady = useContext(TransportClientReadyContext);
  const [
    createTask,
    { loading: taskCreating, error: taskCreateFailed },
  ] = useOperation(todoServices.tasksService.operations.create);

  useEffect(() => {
    if (taskCreateFailed === undefined) return;
    alert(taskCreateFailed);
  }, [taskCreateFailed]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!isReady) return;
    if (newTaskInput) {
      createTask({
        task: {
          label: newTaskInput,
          completed: false,
        },
      }).then(
        ([err]) => {
          if (!err) {
            setNewTaskInput('');
          }
        },
        (err) => {},
      );
    }
    return false;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        disabled={!isReady || taskCreating}
        value={newTaskInput}
        onChange={(e): void => setNewTaskInput(e.target.value)}
      />
    </form>
  );
}
