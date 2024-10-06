import React, { useState } from "react";
import { Input, Button, message, Watermark } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { StyledContainer, Header, InputWrapper } from "./HomeStyle"; // Import the styles
import { getFullSurvey } from "../redux/action/company";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [secretePhrase, setSecretePhrase] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await dispatch(getFullSurvey(secretePhrase) as any);
      console.log(response);
      if (response?.error) {
        message.error(response.error);
      } else if (response?.payload) {
        const surveyId = response.payload?.questionData?.serveyId;
        const companyName = response.payload?.companyData?.name;
        console.log("response: ", response);
        //const companyName =
        if (surveyId) {
          // Append query string directly to the URL
          navigate(`/${companyName}/surveys/${surveyId}`);
          message.success(response.payload.message);
        } else {
          message.error("Survey ID not found");
        }
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while fetching the survey.");
    }
  };

  return (
    <Watermark content="sample">
      <StyledContainer>
        <Header>
          <Button type="link" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button type="link" onClick={() => navigate("/register")}>
            Register
          </Button>
        </Header>
        <InputWrapper>
          <Input
            placeholder="Insert the secret phrase"
            prefix={<SearchOutlined />}
            value={secretePhrase}
            onChange={(e) => setSecretePhrase(e.target.value)}
            onPressEnter={handleSearch}
          />
        </InputWrapper>
      </StyledContainer>
    </Watermark>
  );
};

export default Home;
