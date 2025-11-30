import { formatDistanceToNowStrict } from "date-fns";

export const getAge = (dob: string) => {
  const dateOfBirth = new Date(dob);
  const age = formatDistanceToNowStrict(dateOfBirth);
  return age;
};
