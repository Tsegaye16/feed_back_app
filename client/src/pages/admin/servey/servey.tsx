import React, { useState } from "react";
import "./servey.css";

const Servey: React.FC = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [companyName, setCompanyName] = useState<string>("");
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  const [hasQuestion, setHasQuestion] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [questions, setQuestions] = useState<
    { question: string; reason: string }[]
  >([]);
  const [reason, setReason] = useState<string>("");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgColor(e.target.value);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleSave = () => {
    setShowNavbar(true);
  };

  const handleHasQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHasQuestion(e.target.value === "yes");
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleAddQuestion = () => {
    if (question) {
      setQuestions([...questions, { question, reason }]);
      setQuestion("");
      setReason(""); // Clear reason after adding question
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  return (
    <div>
      {!showNavbar ? (
        <div className="nav-bar-container">
          <h1>Design Your Navbar</h1>
          <div className="inner-container">
            <div className="input-container">
              <input type="file" id="logo-input" onChange={handleLogoChange} />
              <label htmlFor="logo-input">Logo</label>
            </div>
            <div className="input-container">
              <input
                type="color"
                id="bg-color-input"
                value={bgColor}
                onChange={handleBgColorChange}
                title="Select background color"
              />
              <label htmlFor="bg-color-input">Background Color</label>
            </div>
            <div className="input-container">
              <input
                type="color"
                id="text-color-input"
                value={textColor}
                onChange={handleTextColorChange}
                title="Select text color"
              />
              <label htmlFor="text-color-input">Text Color</label>
            </div>
            <div className="input-container">
              <input
                type="text"
                id="company-name-input"
                value={companyName}
                onChange={handleCompanyNameChange}
                placeholder="Enter company name"
              />
              <label htmlFor="company-name-input">Company Name</label>
            </div>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: bgColor,
              color: textColor,
              padding: "10px 20px",
              height: "100px",
              width: "100%",
              position: "fixed",
              top: "0",
              left: "0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            {logo && (
              <img
                src={URL.createObjectURL(logo)}
                alt="Company Logo"
                style={{
                  height: "60%",
                  marginRight: "20px",
                  objectFit: "contain",
                }}
              />
            )}
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {companyName}
            </div>
          </nav>

          <div style={{ marginTop: "120px", padding: "20px" }}>
            <div className="question-section">
              <label>Do you have a true or false question?</label>
              <select onChange={handleHasQuestionChange}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {hasQuestion && (
              <div className="questions-container">
                <div className="input-group">
                  <input
                    type="text"
                    value={question}
                    onChange={handleQuestionChange}
                    placeholder="Enter your question"
                    className="question-input"
                  />
                  <button onClick={handleAddQuestion} className="add-button">
                    Add
                  </button>
                </div>

                {questions.map((q, index) => (
                  <div key={index} className="question-block">
                    <h3 className="question-title">{q.question}</h3>
                    <div className="checkbox-group">
                      <label>
                        True
                        <input type="radio" />
                      </label>
                      <label>
                        False
                        <input type="radio" />
                      </label>
                    </div>
                    <textarea
                      value={q.reason}
                      onChange={handleReasonChange}
                      placeholder="Enter reason"
                      rows={4}
                      className="reason-textarea"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Servey;
