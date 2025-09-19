import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHelpCircle, FiPhone, FiMail, FiMessageCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Help() {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [issueForm, setIssueForm] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    description: ""
  });

  const faqs = [
    {
      id: 1,
      question: "How do I report an issue in my area?",
      answer: "To report an issue, click on the 'Report' button in the navigation, fill out the form with details about the problem, select the appropriate category, and submit. You can also attach photos or videos to help describe the issue better."
    },
    {
      id: 2,
      question: "What types of issues can I report?",
      answer: "You can report various civic issues including road problems (potholes, damaged roads), garbage and waste management, streetlight issues, water leaks, pollution, vandalism, graffiti, and other community-related problems."
    },
    {
      id: 3,
      question: "How long does it take to resolve an issue?",
      answer: "Resolution time varies depending on the type and complexity of the issue. Simple problems like garbage collection may be resolved within 24-48 hours, while major infrastructure issues may take several weeks. You can track the progress in your 'My Tickets' section."
    },
    {
      id: 4,
      question: "Can I report issues anonymously?",
      answer: "Yes, you have the option to report issues anonymously. However, providing your contact information helps us follow up with you about the resolution status and may result in faster processing."
    },
    {
      id: 5,
      question: "How do I track the status of my reported issues?",
      answer: "You can track your issues by going to 'My Tickets' in your profile. Each issue will show its current status: Submitted, In Progress, or Resolved. You'll also receive updates via email if you provided your contact information."
    },
    {
      id: 6,
      question: "What should I do if my issue is not resolved?",
      answer: "If your issue remains unresolved after the expected timeframe, you can escalate it by contacting the helpline numbers provided, or submit a follow-up report with additional details. You can also check the 'Community' section to see if others have reported similar issues."
    },
    {
      id: 7,
      question: "How do I earn points and badges?",
      answer: "You earn points by reporting issues (10 points per report) and when your reported issues get resolved (20 points per resolution). These points help you earn badges and contribute to your community ranking."
    },
    {
      id: 8,
      question: "Is there a mobile app available?",
      answer: "Currently, our service is available through this web application that works on all devices including mobile phones. We're working on a dedicated mobile app that will be available soon."
    }
  ];

  const handleFAQToggle = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the issue to a backend service
    alert("Thank you for your feedback! We'll get back to you within 24 hours.");
    setIssueForm({
      name: "",
      email: "",
      category: "",
      subject: "",
      description: ""
    });
  };

  const handleInputChange = (e) => {
    setIssueForm({
      ...issueForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="helpPage">
      {/* Header */}
      <div className="pageHeader">
        <button className="backBtn" onClick={() => navigate("/home")}>
          <FiArrowLeft />
        </button>
        <h1 className="pageTitle">Help & Support</h1>
      </div>

      <div className="helpContainer">
        {/* Quick Contact Section */}
        <section className="helpSection">
          <h2 className="sectionTitle">
            <FiPhone className="sectionIcon" />
            Quick Contact
          </h2>
          <div className="contactGrid">
            <div className="contactCard">
              <div className="contactIcon">
                <FiPhone />
              </div>
              <h3>Emergency Helpline</h3>
              <p>For urgent civic issues</p>
              <div className="contactNumber">100 / 101 / 102</div>
            </div>
            
            <div className="contactCard">
              <div className="contactIcon">
                <FiMail />
              </div>
              <h3>Email Support</h3>
              <p>For detailed queries</p>
              <div className="contactEmail">support@civicservice.gov.in</div>
            </div>
            
            <div className="contactCard">
              <div className="contactIcon">
                <FiMessageCircle />
              </div>
              <h3>Live Chat</h3>
              <p>Available 24/7</p>
              <div className="contactStatus">Online Now</div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="helpSection">
          <h2 className="sectionTitle">
            <FiHelpCircle className="sectionIcon" />
            Frequently Asked Questions
          </h2>
          <div className="faqContainer">
            {faqs.map((faq) => (
              <div key={faq.id} className="faqItem">
                <button
                  className="faqQuestion"
                  onClick={() => handleFAQToggle(faq.id)}
                >
                  <span>{faq.question}</span>
                  {expandedFAQ === faq.id ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="faqAnswer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/** Government Helpline section removed as requested */}

        {/* Tell Your Issue Section */}
        <section className="helpSection">
          <h2 className="sectionTitle">
            <FiMessageCircle className="sectionIcon" />
            Tell Us Your Issue
          </h2>
          <div className="issueFormCard">
            <p className="formDescription">
              Can't find what you're looking for? Tell us about your specific issue and we'll help you resolve it.
            </p>
            <form onSubmit={handleIssueSubmit} className="issueForm">
              <div className="formRow">
                <div className="field">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={issueForm.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={issueForm.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="field">
                <label>Issue Category</label>
                <select
                  name="category"
                  value={issueForm.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="technical">Technical Issue</option>
                  <option value="reporting">Report Submission Problem</option>
                  <option value="account">Account Related</option>
                  <option value="general">General Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="field">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={issueForm.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="field">
                <label>Detailed Description</label>
                <textarea
                  name="description"
                  value={issueForm.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Please provide as much detail as possible about your issue..."
                />
              </div>

              <button type="submit" className="btn primary">
                Submit Issue
              </button>
            </form>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="helpSection">
          <h2 className="sectionTitle">Additional Resources</h2>
          <div className="resourcesGrid">
            <div className="resourceCard">
              <h3>User Guide</h3>
              <p>Step-by-step instructions on how to use the platform</p>
              <button className="btn secondary">Download PDF</button>
            </div>
            
            <div className="resourceCard">
              <h3>Video Tutorials</h3>
              <p>Watch video guides for common tasks</p>
              <button className="btn secondary">Watch Videos</button>
            </div>
            
            <div className="resourceCard">
              <h3>Community Forum</h3>
              <p>Connect with other users and share experiences</p>
              <button className="btn secondary">Join Forum</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}





