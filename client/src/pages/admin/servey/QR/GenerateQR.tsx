import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@mui/material";

const GenerateQR: React.FC = () => {
  const qrCodeUrl = "http://localhost:3000/perago";

  const generatePDF = async () => {
    const qrCodeElement = document.getElementById("qrCode");

    if (qrCodeElement) {
      // Convert the QR code to an image using html2canvas
      const canvas = await html2canvas(qrCodeElement);
      const imgData = canvas.toDataURL("image/png");

      // Generate PDF using jsPDF
      const pdf = new jsPDF();
      pdf.text("QR Code to Perago", 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, 180, 180);
      pdf.save("QRCode.pdf");
    }
  };

  return (
    <div>
      <div id="qrCode" style={{ textAlign: "center", margin: "20px" }}>
        {/* QR Code Component */}
        <QRCodeCanvas value={qrCodeUrl} size={256} />
      </div>

      {/* Button to generate PDF */}
      <Button variant="contained" color="primary" onClick={generatePDF}>
        Generate PDF
      </Button>
    </div>
  );
};

export default GenerateQR;
