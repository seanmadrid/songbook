import styled from "@emotion/styled";
import { Tab as Tabber } from "@chakra-ui/react";

export const Tab = styled(Tabber)`
  font-size: 12px;
  font-weight: bold;
  color: var(--foreground);
  white-space: nowrap;
  flex: 1;
  background-color: var(--foreground-alt);

  @media (min-width: 768px) {
    font-size: 24px;
    font-family: "Ojuju", serif;
    // width: calc(100% / 3);
  }

  svg {
    margin-right: 4px;
    @media (min-width: 768px) {
      margin-right: 8px;
    }
  }
`;
