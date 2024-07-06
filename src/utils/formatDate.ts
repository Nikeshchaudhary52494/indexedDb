import { format } from 'date-fns';

export const formatDate = (timestamp: number): string => {
  return format(new Date(timestamp), 'PPpp'); // Example: Jul 6, 2024, 1:23 PM
};
