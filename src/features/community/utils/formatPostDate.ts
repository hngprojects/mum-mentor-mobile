// src/features/community/utils/formatPostDate.ts

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatPostDate = (isoDate: string): string => {
  if (!isoDate) return '';
  return dayjs(isoDate).fromNow(); // e.g. "2h ago"
};
