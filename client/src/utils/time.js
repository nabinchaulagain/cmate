export const convertTime = timeInSeconds => {
  let hours = Math.floor(timeInSeconds / 3600);
  let minutes = Math.floor(timeInSeconds / 60 - hours * 60);
  let seconds = timeInSeconds - hours * 3600 - minutes * 60;
  hours = "0" + hours;
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return { hours, minutes, seconds };
};
