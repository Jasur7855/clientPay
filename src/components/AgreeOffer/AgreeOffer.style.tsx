import styled from "styled-components";

export const SAgreeOffer = styled.div`
  width: 340px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 16px;

  h4 {
    font-size: 18px;
    text-transform: uppercase;
    font-weight: 400;
    margin-bottom: 24px;
    
    a {
      text-decoration: underline;
      color: black;
    }
  }
`;

// Скрытый чекбокс
export const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

// Кастомный чекбокс
export const StyledCheckbox = styled.div<{ checked: boolean }>`
  width: 24px;
  height: 24px;
  
  border: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: ${({ checked }) => (checked ? "transparent" : "transparent")};

  svg {
    width: 16px;
    height: 16px;
    stroke: white;
    opacity: ${({ checked }) => (checked ? "1" : "0")};
    transition: opacity 0.2s ease-in-out;
  }
`;
