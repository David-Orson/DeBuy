type Brightness =
    | 10
    | 20
    | 30
    | 50
    | 60
    | 70
    | 80
    | 90
    | 100
    | 110
    | 120
    | 130
    | 140
    | 150
    | 160
    | 170
    | 180
    | 190
    | 200;

type Hover = 10 | 20;

export const color = {
    primary: (b: Brightness) => `hsl(273, 100%, ${b / 2}%)`,
    secondary: (b: Brightness) => `hsl(25, 100%, ${b / 2}%)`,
    slate: (h: boolean = false) => `hsl(273, 21%, ${h ? 15 : 11}%)`,
    text: "hsl(0, 100%, 97%)",
};

const adjustBrightness = (b: Brightness, adjustment: number): Brightness => {
    const newBrightness = b + adjustment;
    if ([40, 50, 60, 70, 80, 90, 100, 110].includes(newBrightness)) {
        return newBrightness as Brightness;
    }
    throw new Error("Invalid brightness adjustment");
};

export const gradient = {
    primary: (b: Brightness) =>
        `linear-gradient(168deg, ${color.primary(b)} 0%, ${color.primary(
            adjustBrightness(b, 40)
        )} 100%)`,
    secondary: (b: Brightness) =>
        `linear-gradient(168deg, ${color.secondary(b)} 0%, ${color.secondary(
            adjustBrightness(b, -40)
        )} 100%)`,
};

export default color;
