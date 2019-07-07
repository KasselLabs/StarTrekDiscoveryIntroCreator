const DURATION = 5;
const sequence = Array.from(new Array(100)).map((_, i) => ({
  x: 30,
  y: 30,
  duration: DURATION,
  start: i * DURATION,
  texts: ['Executive Producer', 'Darth', 'Vader'],
}));

export default {
  defaults: {
    duration: 5,
    classes: ['small top shrinking', 'shrinking', 'expanding'],
  },
  sequence,
};
