// npm
import styled from "styled-components";

type Justify =
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
type Align = "center" | "flex-start" | "flex-end" | "baseline" | "stretch";

type Gap = 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56;

type FlexProps = {
    col?: boolean;
    wFull?: boolean;
    minHeight?: string;
    justify?: Justify;
    align?: Align;
    bg?: string;
    gap?: Gap;
};

export const Flex = styled.div<FlexProps>`
    position: relative;
    display: flex;
    flex-direction: ${({ col }) => (col ? "column" : "row")};
    justify-content: ${({ justify }) => justify || "center"};
    align-items: ${({ align }) => align || "center"};
    min-height: ${({ minHeight }) => minHeight || 0};
    width: ${({ wFull }) => wFull && "100%"};
    ${({ bg }) => bg && `background: ${bg}`};
    ${({ gap }) => gap && `gap: ${gap}px`};
`;
