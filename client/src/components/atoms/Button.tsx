// npm
import React, { useState } from "react";
import styled, { css } from "styled-components";

// theme
import theme from "../../theme";

type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
};
export const Button = ({ onClick, children, size = "md" }: ButtonProps) => {
    // state
    const [glowPosition, setGlowPosition] = useState(0);
    const [buttonWidth, setButtonWidth] = useState(0);

    // methods
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonRect = e.currentTarget.getBoundingClientRect();
        setGlowPosition(
            ((e.clientX - buttonRect.left) / buttonRect.width) * 100
        );
        setButtonWidth(buttonRect.width);
    };

    return (
        <StyledButton
            onClick={onClick}
            size={size}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setGlowPosition(0)}
            glowPosition={glowPosition}
            innerWidth={buttonWidth}
        >
            {children}
        </StyledButton>
    );
};

type StyledButtonProps = {
    size?: "sm" | "md" | "lg";
    glowPosition: number;
    innerWidth: number;
};

const g = 0.4;

const StyledButton = styled.button<StyledButtonProps>`
    position: relative;
    background: ${theme.gradient.secondary(100)};
    color: ${theme.color.text};
    padding: ${theme.spacing[8]} ${theme.spacing[32]};
    border-radius: ${theme.radius.sm};
    border: none;
    cursor: pointer;
    font: ${theme.font()["2xl"](700)};
    box-sizing: border-box;

    &:hover {
        background: ${theme.gradient.secondary(90)};
        box-shadow: 0px 0px 50px #fff4;
    }

    &::before,
    &::after {
        content: "";
        position: absolute;
        transition: ${theme.transition("box-shadow", 2, 1)};
        box-shadow: 0px 0px 0px ${theme.color.primary(120)};
    }

    &:hover::before,
    &:hover::after {
        height: 70%;
        background: transparent;
    }

    &:hover::before {
        width: ${({ innerWidth }) => innerWidth * g}px;
        clip-path: ellipse(75% 150% at 50% -100%);

        // Glow on the top left
        top: 0px;
        left: ${({ glowPosition, innerWidth }) =>
            glowPosition - innerWidth * g * (glowPosition / innerWidth)}%;
        box-shadow: 2px -5px 25px ${theme.color.primary(140)};
        border-radius: ${theme.radius.sm};
    }

    &:hover::after {
        width: ${({ innerWidth }) => innerWidth * g}px;
        clip-path: ellipse(75% 150% at 50% 218%);

        // Glow on the bottom right
        bottom: 0px;
        right: ${({ glowPosition, innerWidth }) =>
            glowPosition - innerWidth * g * (glowPosition / innerWidth)}%;
        box-shadow: -2px 5px 25px ${theme.color.primary(100)};
        border-radius: ${theme.radius.sm};
    }

    ${(props) =>
        props.size === "sm"
            ? css`
                  min-width: 100px;
              `
            : null}
    ${(props) =>
        props.size === "md"
            ? css`
                  min-width: 200px;
              `
            : null}
    ${(props) =>
        props.size === "lg"
            ? css`
                  min-width: 300px;
              `
            : null}
`;

export default Button;
