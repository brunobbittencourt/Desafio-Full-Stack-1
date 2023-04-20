import styled from "styled-components";

export const StyledContact = styled.li`
  background-color: #f3f4f6;
  text-decoration: none;
  font-size: 16px;
  list-style: none;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 8px;
  &:hover {
    filter: brightness(0.7);
    cursor: pointer;
  }
`;
