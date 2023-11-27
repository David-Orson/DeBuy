// npm
import styled from "styled-components";

// theme
import theme from "../../theme";

type Px = 2 | 4 | 8 | 16 | 32 | 64;

type PaddingProps = {
    px?: Px;
};

export const Padding = styled.div<PaddingProps>`
    padding: ${({ px }) => (px ? theme.spacing[px] : theme.spacing[16])};
`;

export default Padding;
