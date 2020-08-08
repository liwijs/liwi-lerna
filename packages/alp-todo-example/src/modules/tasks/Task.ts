import { MongoBaseModel } from 'liwi-mongo';

export interface DraftTask {
  completed: boolean;
  label: string;
}

export type Task = MongoBaseModel & DraftTask;