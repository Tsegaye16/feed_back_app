import React from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";

// Styled container for layout and background
const StyledContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #f0f2f5;
  overflow: hidden; /* Prevent scrolling */

  /* Attractive background */
  background: linear-gradient(135deg, #e2e2e2, #c9d6ff);
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
  z-index: 1;

  .ant-btn {
    font-size: 1rem;
    margin-left: 15px;
  }
`;

// Wrapper for the input field
const InputWrapper = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -100px;

  .ant-input-affix-wrapper {
    width: 700px;
    height: 50px;
    border-radius: 30px;
    font-size: 1.2rem;
    padding: 0 20px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    border: none;
    outline: none;
    transition: all 0.3s ease;

    &:focus-within {
      box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    }

    .ant-input-prefix {
      color: rgba(0, 0, 0, 0.45); /* Icon color */
      font-size: 1.5rem;
    }
  }

  /* Media queries for responsiveness */
  @media (max-width: 768px) {
    .ant-input-affix-wrapper {
      width: 100%; /* Full width for tablet and mobile */
      height: 50px;
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .ant-input-affix-wrapper {
      width: 90%; /* Slight margin for small screens */
      height: 45px;
      font-size: 0.9rem;
    }
  }
`;

const Home: React.FC = () => {
  return (
    <StyledContainer>
      <Header>
        <Button type="link" href="/login">
          Login
        </Button>
        <Button type="link" href="/register">
          Register
        </Button>
      </Header>
      <InputWrapper>
        <Input
          placeholder="Insert the secret phrase"
          prefix={
            <SearchOutlined />
          } /* Adding the search icon inside the input */
        />
      </InputWrapper>
    </StyledContainer>
  );
};

export default Home;
