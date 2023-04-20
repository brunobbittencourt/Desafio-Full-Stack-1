import styled from "styled-components";

export const StyledDashboard = styled.section`
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f3f4f6;
  align-items: center;
  width: 90%;
  max-width: 31rem;
  height: 28rem;
  border-radius: 1rem;
  padding: 1rem;
  gap: 1.5rem;

  form {
    background-color: #f3f4f6;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input {
    background-color: #f9fafb;
    font-weight: 100;
    border-radius: 8px;
    padding: 8px;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    background-color: #f3f4f6;
  }

  button {
    background-color: #9ca3af;
    padding: 8px;
    border-radius: 8px;
    font-weight: 600;
  }

  ul {
    width: 90%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;
