type Property =
    | "all"
    | "background"
    | "color"
    | "opacity"
    | "transform"
    | "box-shadow";
type Increment = 1 | 2 | 4 | 6 | 8 | 10;

export const transition = (prop: Property, i: Increment, d?: Increment) =>
    `${prop} ${i / 10}s ease-in-out${d && ` ${d / 10}s`}`;

export default transition;
