// npm
import React from "react";

// components
import { Button, Flex, FlexCol, Logo, Title } from "../atoms";
import Padding from "../atoms/Padding";
import theme from "../../theme";

type LandingHeaderProps = {
    connect: () => void;
};

export const LandingHeader = ({ connect }: LandingHeaderProps) => {
    return (
        <Padding>
            <Flex justify="flex-start">
                <Logo />
            </Flex>
            <FlexCol minHeight={theme.spacing[512]}>
                <Title>The Digital Asset Trading Future</Title>
                <Button onClick={connect}>connect</Button>
            </FlexCol>
        </Padding>
    );
};

export default LandingHeader;
