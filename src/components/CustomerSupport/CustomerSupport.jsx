import React, { useState } from "react";
import "./CustomerSupport.css"; // Add styles here
import axios from "axios";

const CustomerSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [report, setReport] = useState("");

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  // console.log(JSON.parse(localStorage.getItem("userInfo")).data.user._id);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle report submission logic here
    console.log("Report Submitted:", report);
    // Close the popup
    if (!report.trim()) {
      alert("Please write a query before submitting.");
      return;
    }

    try {
      setIsSubmitting(true); // Disable button while submitting
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      const { data } = await axios.post(
        `https://codenova-server.onrender.com/api/v1/report/report-discussion`,
        {
          content: report,
          chatId: JSON.parse(localStorage.getItem("userInfo")).data.user._id,
        },
        config
      );
      console.log("Report Submitted:", data);

      setReport("");
      setIsOpen(false);
      alert("Your report has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred while submitting your report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="customer-support">
      <button className="support-button" onClick={togglePopup}>
        Support
      </button>
      {isOpen && (
        <div className="support-popup">
          <div className="popup-header">
            <h3>Submit a Report</h3>
            <button className="close-button" onClick={togglePopup}>
              ✖
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Describe your issue..."
              value={report}
              onChange={(e) => setReport(e.target.value)}
              required
            />
            <button type="submit" onClick={handleSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerSupport;
