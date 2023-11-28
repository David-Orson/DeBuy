// npm
import React from "react";
import styled from "styled-components";

// context
import { useDropdownContext } from "../molecules/Dropdown";

// theme
import theme from "../../theme";

type OptionProps = {
    children: React.ReactNode;
    onClick?: () => void;
};

export const Option = ({ children, onClick }: OptionProps) => {
    // context
    const { setOpen } = useDropdownContext();

    // methods
    const handleClick = () => {
        if (onClick) onClick();

        setOpen(false);
    };

    return <StyledOption onClick={handleClick}>{children}</StyledOption>;
};

const StyledOption = styled.li`
    display: inline-block;
    color: ${theme.color.text};
    padding: ${theme.spacing[8]} ${theme.spacing[32]};
    cursor: pointer;
    font: ${theme.font().md(600)};
    user-select: none;
    width: 100%;

    &:hover {
        background: ${theme.color.slate(true)};
    }
`;

export default Option;
