// npm
import React from "react";
import styled from "styled-components";

// theme
import theme from "../../theme";

// hooks
import { useWindowSize } from "../../hooks/ui/useWindowSize";

type TitleProps = {
    children: React.ReactNode;
    h?: number;
};

export const Title = ({ children, h }: TitleProps) => {
    // hooks
    const w = useWindowSize();

    // methods
    const renderTitle = (h: number) => {
        switch (h) {
            case 1:
                return <StyledH1 size={w}>{children}</StyledH1>;
            case 2:
                return <StyledH2 size={w}>{children}</StyledH2>;
            case 3:
                return <StyledH3 size={w}>{children}</StyledH3>;
            case 4:
                return <StyledH4 size={w}>{children}</StyledH4>;
            default:
                return <StyledH1 size={w}>{children}</StyledH1>;
        }
    };

    return <>{renderTitle(h || 1)}</>;
};

type StyledTitleProps = {
    size: number;
};

const StyledH1 = styled.h1<StyledTitleProps>`
    max-width: 80%;
    color: ${theme.color.text};
    font: ${({ size }) => theme.font(size).h1(700)};
    text-align: center;
    user-select: none;
`;

const StyledH2 = styled.h2<StyledTitleProps>`
    max-width: 80%;
    color: ${theme.color.text};
    font: ${({ size }) => theme.font(size).h2(700)};
    text-align: center;
    user-select: none;
`;

const StyledH3 = styled.h3<StyledTitleProps>`
    max-width: 80%;
    color: ${theme.color.text};
    font: ${({ size }) => theme.font(size).h3(700)};
    text-align: center;
    user-select: none;
`;

const StyledH4 = styled.h4<StyledTitleProps>`
    max-width: 80%;
    color: ${theme.color.text};
    font: ${({ size }) => theme.font(size).h4(700)};
    text-align: center;
    user-select: none;
`;

export default Title;
