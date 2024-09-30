import React from "react";

interface DetailProps {
  id: string; // or 'any' if you prefer flexibility with the data type
}

const Detail: React.FC<DetailProps> = ({ id }) => {
  return (
    <div>
      <h2>Survey Detail</h2>
      <p>Displaying details for survey ID: {id}</p>
      {/* Add more detailed content here based on the survey ID */}
    </div>
  );
};

export default Detail;
