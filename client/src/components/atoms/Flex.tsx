// npm
import styled, { css } from "styled-components";
import { Gap } from "../../theme/spacing";

type Justify =
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
type Align = "center" | "flex-start" | "flex-end" | "baseline" | "stretch";

type FlexProps = {
    children: React.ReactNode;
    col?: boolean;
    wfull?: boolean;
    minheight?: string;
    justify?: Justify;
    align?: Align;
    bg?: string;
    gap?: Gap;
};

export const Flex = ({
    children,
    col,
    wfull,
    minheight,
    justify,
    align,
    bg,
    gap,
}: FlexProps) => {
    return (
        <StyledFlex
            $col={col ? 1 : 0}
            $wfull={wfull ? 1 : 0}
            $minheight={minheight}
            $justify={justify}
            align={align}
            bg={bg}
            $gap={gap}
        >
            {children}
        </StyledFlex>
    );
};

type StyledFlexProps = {
    $col: number;
    $wfull?: number;
    $minheight?: string;
    $justify?: Justify;
    align?: Align;
    bg?: string;
    $gap?: Gap;
};

const StyledFlex = styled.div<StyledFlexProps>`
    position: relative;
    display: flex;
    flex-direction: ${({ $col }) => ($col ? "column" : "row")};
    justify-content: ${({ $justify }) => $justify || "center"};
    align-items: ${({ align }) => align || "center"};
    min-height: ${({ $minheight }) => $minheight || 0};
    ${({ $wfull }) =>
        $wfull &&
        css`
            width: 100%;
        `};
    ${({ bg }) =>
        bg &&
        css`
            background: ${bg};
        `};
    ${({ $gap }) =>
        $gap &&
        css`
            gap: ${$gap};
        `};
`;
