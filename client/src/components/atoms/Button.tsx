// npm
import React, { useState } from "react";
import styled, { css } from "styled-components";

// theme
import theme from "../../theme";

type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
    glow?: boolean;
};
export const Button = ({
    onClick,
    children,
    size = "md",
    glow = false,
}: ButtonProps) => {
    // state
    const [glowposition, setglowposition] = useState(0);
    const [innerwidth, setinnerwidth] = useState(0);

    // methods
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonRect = e.currentTarget.getBoundingClientRect();
        setglowposition(
            ((e.clientX - buttonRect.left) / buttonRect.width) * 100
        );
        setinnerwidth(buttonRect.width);
    };

    return (
        <StyledButton
            onClick={onClick}
            size={size}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setglowposition(0)}
            $glowposition={glowposition}
            $innerwidth={innerwidth}
            $glow={glow ? 1 : 0}
        >
            {children}
        </StyledButton>
    );
};

type StyledButtonProps = {
    size?: "sm" | "md" | "lg";
    $glow: number;
    $glowposition: number;
    $innerwidth: number;
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
    user-select: none;

    &:hover {
        background: ${theme.gradient.secondary(90)};
    }

    ${({ $glow, $glowposition, $innerwidth }) =>
        $glow
            ? css`
                  &:hover {
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
                      width: ${$innerwidth * g}px;
                      clip-path: ellipse(75% 150% at 50% -100%);

                      // Glow on the top left
                      top: 0px;
                      left: ${$glowposition -
                      $innerwidth * g * ($glowposition / $innerwidth)}%;
                      box-shadow: 2px -5px 25px ${theme.color.primary(140)};
                      border-radius: ${theme.radius.sm};
                  }

                  &:hover::after {
                      width: ${$innerwidth * g}px;
                      clip-path: ellipse(75% 150% at 50% 218%);

                      // Glow on the bottom right
                      bottom: 0px;
                      right: ${$glowposition -
                      $innerwidth * g * ($glowposition / $innerwidth)}%;
                      box-shadow: -2px 5px 25px ${theme.color.primary(100)};
                      border-radius: ${theme.radius.sm};
                  }
              `
            : null}

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
