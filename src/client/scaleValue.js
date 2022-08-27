// value must be between 0 and 1
const scaleValue = (value, min, max) =>
    ((max - min) * value) + min;

export default scaleValue;