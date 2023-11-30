// npm
import React from "react";

// components
import { Button, DeBxBalance, Flex, Padding, Title } from "../atoms";

// theme
import theme from "../../theme";

type PageTitleProps = {
    title: string;
};

export const PageTitle = ({ title }: PageTitleProps) => {
    return (
        <Padding>
            <Flex justify="space-between">
                <Title h={3}>{title}</Title>
                <Flex justify="space-between" gap={theme.spacing[32]}>
                    <DeBxBalance />
                    <Button onClick={() => console.log("hi")} size="sm">
                        +
                    </Button>
                </Flex>
            </Flex>
        </Padding>
    );
};

export default PageTitle;
