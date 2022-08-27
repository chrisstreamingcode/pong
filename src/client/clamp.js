const clamp = (value, min, max) =>
    Math.min(max, Math.max(value, min));

// max => 600
// y => 700

// 600;

export default clamp;