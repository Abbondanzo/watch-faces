export const zeroPad = (time: number) => {
  if (time < 10) {
    return `0${time}`;
  }
  return String(time);
};
