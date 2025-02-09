import styled from "styled-components";

export const SLoader = styled.div`
  position:fixed;
  top:0;
  left:0;
  min-width: 100%;
  min-height: 100vh;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  .loader {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .loader:before,
  .loader:after {
    content: "";
    border-radius: 50%;
    position: absolute;
    inset: 0;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
  }
  .loader:after {
    box-shadow: 0 2px 0 #ff3d00 inset;
    animation: rotate 2s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
