// npm
import React from "react";

// components
import { Button, Flex, Logo, Title } from "../atoms";
import Padding from "../atoms/Padding";

// theme
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
            <Flex col minheight={theme.spacing[512]} justify="space-evenly">
                <Title>The Digital Asset Trading Future</Title>
                <Button onClick={connect} glow>
                    connect
                </Button>
            </Flex>
        </Padding>
    );
};

export default LandingHeader;
