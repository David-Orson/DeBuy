// npm
import React from "react";
import styled from "styled-components";

// theme
import theme from "../../theme";

// components
import { Flex, Font } from "./";

export const DeBxBalance = () => {
    return (
        <Flex gap={theme.spacing[8]}>
            <StyledBalance>
                <Flex minheight="100%">De$</Flex>
            </StyledBalance>
            <Font size={"3xl"} weight={600} select={false}>
                100
            </Font>
        </Flex>
    );
};

const StyledBalance = styled.div`
    border-radius: 100%;
    width: 65px;
    height: 65px;
    background: ${theme.gradient.secondary(100)};
    font: ${theme.font().xl(600)};
    user-select: none;
`;

export default DeBxBalance;
