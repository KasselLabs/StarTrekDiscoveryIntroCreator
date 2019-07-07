export default {
  defaults: {
    duration: 2,
    classes: ["shrinking", "expanding"],
  },
  sequence: [
    {
      x: 20,
      y: 70,
      duration: 2,
      start: 0,
      classes: ["small top shrinking", "shrinking", "expanding"],
    },
    {
      x: 70,
      y: 20,
      duration: 3,
      start: 2,
    },
  ],
}
