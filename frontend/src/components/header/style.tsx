import styled from "styled-components";

export const StyledHeader = styled.header`
  height: 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 1rem;
  font-weight: 700;
  background-color: #f3f4f6;
  padding: 24px 10vw;
  margin-bottom: 16px;
  -webkit-box-shadow: 2px 6px 3px -3px rgba(41, 41, 41, 0.6);
  -moz-box-shadow: 2px 6px 3px -3px rgba(41, 41, 41, 0.6);
  box-shadow: 2px 6px 3px -3px rgba(41, 41, 41, 0.6);

  button {
    background-color: #9ca3af;
    padding: 6px;
    border-radius: 8px;
    font-weight: 500;
    &:hover {
      cursor: pointer;
      filter: brightness(0.9);
    }
  }
`;
