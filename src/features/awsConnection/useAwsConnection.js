import { useContext } from 'react';
import { AwsConnectionContext } from './AwsConnectionContext.jsx';

export const useAwsConnection = () => {
  const context = useContext(AwsConnectionContext);
  if (!context) throw new Error('useAwsConnection must be used within an AwsConnectionProvider');
  return context;
};
