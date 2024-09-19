import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@mui/material";

const GenerateQR: React.FC = () => {
  const qrCodeUrl = "http://localhost:3000/sample";

  const generatePDF = async () => {
    const qrCodeElement = document.getElementById("qrCode");

    if (qrCodeElement) {
      // Convert the QR code to an image using html2canvas
      const canvas = await html2canvas(qrCodeElement);
      const imgData = canvas.toDataURL("image/png");

      // Generate PDF using jsPDF
      const pdf = new jsPDF();
      pdf.text("QR Code to sample", 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, 100, 100);
      pdf.save("QRCode.pdf");
    }
  };

  const downloadImage = async () => {
    const qrCodeElement = document.getElementById("qrCode");

    if (qrCodeElement) {
      // Convert the QR code to an image using html2canvas
      const canvas = await html2canvas(qrCodeElement);
      const imgData = canvas.toDataURL("image/png");

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "QRCode.png"; // The name of the downloaded file

      // Trigger the download
      link.click();
    }
  };

  return (
    <div>
      <div id="qrCode" style={{ textAlign: "center", margin: "20px" }}>
        {/* QR Code Component */}
        <QRCodeCanvas value={qrCodeUrl} size={256} />
      </div>

      {/* Button to generate PDF */}
      <Button color="primary" onClick={generatePDF}>
        Generate PDF
      </Button>
      <Button
        color="secondary"
        onClick={downloadImage}
        style={{ marginLeft: "10px" }}
      >
        Download Image
      </Button>
    </div>
  );
};

export default GenerateQR;
