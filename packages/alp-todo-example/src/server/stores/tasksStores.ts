import type { Task } from 'modules/tasks/Task';
import {
  createMongoSubscribeStore,
  createMongoStore,
} from './createMongoStore';

export const tasksStore = createMongoSubscribeStore<Task>(
  createMongoStore('tasks'),
);
