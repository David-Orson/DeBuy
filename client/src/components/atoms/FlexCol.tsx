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

type FlexColProps = {
    minHeight?: string;
    justify?: Justify;
    align?: Align;
};

export const FlexCol = styled.div<FlexColProps>`
    display: flex;
    flex-direction: column;
    justify-content: ${({ justify }) => justify || "center"};
    align-items: ${({ align }) => align || "center"};
    min-height: ${({ minHeight }) => minHeight || 0};
`;

export default FlexCol;
