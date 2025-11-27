export function logErrorInDevMode(error: string) {
  if (__DEV__) {
    console.log(error);
  }
}
