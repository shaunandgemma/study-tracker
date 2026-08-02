import React from 'react';
import { useTask } from '../../context/TaskContext';
import { TaskList } from './TaskList';
import { TaskGuide } from './TaskGuide';
import { AwsSetupGuide } from './AwsSetupGuide';

export const HandsOnTasksView = () => {
  const { activeTaskId, subView } = useTask();

  if (subView === 'aws-setup') {
    return <AwsSetupGuide />;
  }

  if (subView === 'guide' || activeTaskId) {
    return <TaskGuide />;
  }

  return (
    <div className="w-full">
      <TaskList />
    </div>
  );
};
