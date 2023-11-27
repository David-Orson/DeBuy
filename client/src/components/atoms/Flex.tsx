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

type FlexProps = {
    justify?: Justify;
    align?: Align;
};

export const Flex = styled.div<FlexProps>`
    display: flex;
    justify-content: ${({ justify }) => justify || "center"};
    align-items: ${({ align }) => align || "center"};
`;
