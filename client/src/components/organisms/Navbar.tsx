// npm
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Outlet, useNavigate } from "react-router";
import styled from "styled-components";

// types
import { W3 } from "../../types";

// components
import { Dropdown } from "../molecules";
import { Flex, Logo, Option, Padding } from "../atoms";

// hooks
import { useWindowSize } from "../../hooks/ui/useWindowSize";

// theme
import theme from "../../theme";

type NavbarProps = {
    w3: W3;
    setW3: (w3: W3) => void;
    addr: string;
};

export const Navbar = ({ w3, setW3, addr }: NavbarProps) => {
    // hooks
    const navigate = useNavigate();
    const width = useWindowSize();

    // memo
    const formattedAddr = useMemo(() => {
        return addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "";
    }, [addr]);

    // methods
    const logout = () => {
        localStorage.removeItem("userAddr");
        navigate("/");
        setW3({
            ...w3,
            userAddr: "",
            balance: BigInt(0),
        });
    };

    const openDeBx = () => {
        window.open("https://debx.finance", "_blank");
    };

    return (
        <>
            <Padding>
                <Flex wFull justify="space-between">
                    <Logo />
                    <Flex justify="flex-end" gap={width > 480 ? 32 : 16}>
                        <StyledLink to={"/shop/browse"}>Shop</StyledLink>
                        <Dropdown label={formattedAddr}>
                            <Option onClick={() => navigate("./profile")}>
                                Profile
                            </Option>
                            <Option onClick={openDeBx}>Buy DeBx</Option>
                            <Option onClick={logout}>Log Out</Option>
                        </Dropdown>
                    </Flex>
                </Flex>
            </Padding>
            <Outlet />
        </>
    );
};

const StyledLink = styled(Link)`
    text-decoration: none;
    color: ${theme.color.text};
    font: ${theme.font().md(700)};
    user-select: none;
`;

export default Navbar;
