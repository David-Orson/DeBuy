// npm
import React, { useState, createContext, useContext } from "react";
import styled, { css } from "styled-components";

// components
import { Flex } from "../atoms";

// theme
import theme from "../../theme";

// context
const setOpen: { setOpen: React.Dispatch<React.SetStateAction<boolean>> } = {
    setOpen: () => {},
};
const DropdownContext = createContext(setOpen);

export const useDropdownContext = () => useContext(DropdownContext);

type DropdownProps = {
    label: string;
    children: React.ReactNode;
};

// component
export const Dropdown = ({ label, children }: DropdownProps) => {
    // state
    const [open, setOpen] = useState(false);

    return (
        <Flex col>
            <StyledDropdown onClick={() => setOpen(!open)} open={open}>
                <Flex justify="space-between">
                    {label} <Caret open={open} />
                </Flex>
            </StyledDropdown>
            {open && (
                <StyledUl>
                    <Flex col>
                        <DropdownContext.Provider value={{ setOpen }}>
                            {children}
                        </DropdownContext.Provider>
                    </Flex>
                </StyledUl>
            )}
        </Flex>
    );
};

type StyledDropdownProps = {
    open: boolean;
};

const StyledDropdown = styled.div<StyledDropdownProps>`
    background: ${theme.color.slate()};
    color: ${theme.color.text};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.md};
    padding: ${theme.spacing[12]};
    cursor: pointer;
    font: ${theme.font().md(700)};
    transition: ${theme.transition("background")};
    border: 2px solid transparent;
    user-select: none;

    &:hover {
        background: ${theme.color.slate(true)};
    }

    ${({ open }) =>
        open &&
        css`
            border: 2px solid #fff4;
            box-sizing: border-box;
            box-shadow: 0px 0px 50px #fff4;
        `};
`;

const StyledUl = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: ${theme.color.slate()};
    border-radius: ${theme.radius.md};
    padding: ${theme.spacing[12]} 0;
    box-sizing: border-box;
    text-decoration: none;
`;

const Caret = styled.div<StyledDropdownProps>`
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid ${theme.color.text};
    margin-left: ${theme.spacing[16]};
    transition: ${theme.transition("transform")};

    ${({ open }) =>
        open &&
        css`
            transform: rotate(-180deg);
        `};
`;

export default Dropdown;
