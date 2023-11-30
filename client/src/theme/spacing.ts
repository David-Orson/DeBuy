export type Gap =
    | "2px"
    | "4px"
    | "8px"
    | "12px"
    | "16px"
    | "32px"
    | "64px"
    | "128px"
    | "256px"
    | "512px"
    | "1024px";

export const spacing: { [key: number]: Gap } = {
    2: "2px",
    4: "4px",
    8: "8px",
    12: "12px",
    16: "16px",
    32: "32px",
    64: "64px",
    128: "128px",
    256: "256px",
    512: "512px",
    1024: "1024px",
};

export default spacing;
