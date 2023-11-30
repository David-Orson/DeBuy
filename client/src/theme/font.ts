export type Weight = 300 | 400 | 500 | 600 | 700;

const calculateMultiplier = (width: number) => {
    if (width > 1025) return 1;
    if (width > 768) return 0.8;
    if (width > 480) return 0.65;
    return 0.5;
};

export const font = (
    width = 1000
): { [key: string]: (w: Weight) => string } => {
    const family = "'Work Sans', sans-serif";
    const m = calculateMultiplier(width);

    return {
        "2xs": (w: Weight) => `${w} 10px ` + family,
        xs: (w: Weight) => `${w} 12px ` + family,
        sm: (w: Weight) => `${w} 14px ` + family,
        md: (w: Weight) => `${w} 16px ` + family,
        lg: (w: Weight) => `${w} 18px ` + family,
        xl: (w: Weight) => `${w} 20px ` + family,
        "2xl": (w: Weight) => `${w} 24px ` + family,
        "3xl": (w: Weight) => `${w} 28px ` + family,
        "4xl": (w: Weight) => `${w} 32px ` + family,
        "5xl": (w: Weight) => `${w} 36px ` + family,

        h1: (w: Weight) => `${w} ${m * 4.8}rem ` + family,
        h2: (w: Weight) => `${w} ${m * 4}rem ` + family,
        h3: (w: Weight) => `${w} ${m * 3.2}rem ` + family,
        h4: (w: Weight) => `${w} ${m * 2.4}rem ` + family,
        h5: (w: Weight) => `${w} ${m * 1.6}rem ` + family,
        h6: (w: Weight) => `${w} ${m * 0.8}rem ` + family,
    };
};

export default font;
