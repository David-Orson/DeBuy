// npm
import React from "react";
import styled, { css } from "styled-components";

// theme
import theme from "../../theme";

// types
import { Weight } from "../../theme/font";

type FontProps = {
    children: React.ReactNode;
    size?: string;
    weight?: Weight;
    select?: boolean;
};

export const Font = ({ children, size, weight, select = true }: FontProps) => {
    return (
        <StyledFont size={size} weight={weight} select={select ? 1 : 0}>
            {children}
        </StyledFont>
    );
};

type StyledFontProps = {
    size?: string;
    weight?: Weight;
    select: number;
};

const StyledFont = styled.div<StyledFontProps>`
    ${({ size, weight }) =>
        css`
            font: ${theme.font()[size || "md"](weight || 400)};
        `};
    ${({ select }) =>
        select
            ? ""
            : css`
                  user-select: none;
              `};
`;

export default Font;
