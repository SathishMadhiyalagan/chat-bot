import React from "react";
import Navbar from "../components/Navbar"; // Adjust the path as needed
import Footer from "../components/Footer"; // Adjust the path as needed

const Home = () => {
  return (
    <div className="bg-[#e5e7eb] min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#506169]">Welcome to LLL</h1>
          <p className="text-xl text-[#6e7f87] mt-4">
            A document management system for admins, editors, and users.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Upload and Build Model */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-[#506169] mb-4">
              Upload and Build Model
            </h2>
            <p className="text-[#6e7f87] mb-4">
              Upload PDF and Word files to build AI models for document processing.
            </p>
            <a
              href="/upload"
              className="bg-[#506169] text-white py-2 px-6 rounded-lg hover:bg-[#daf1f4] transition duration-300"
            >
              Start Upload
            </a>
          </div>

          {/* Admin and Editor Roles */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-[#506169] mb-4">
              Admin and Editor Roles
            </h2>
            <p className="text-[#6e7f87] mb-4">
              Manage users, permissions, and document processing from the admin and editor dashboard.
            </p>
            <a
              href="/admin"
              className="bg-[#506169] text-white py-2 px-6 rounded-lg hover:bg-[#daf1f4] transition duration-300"
            >
              Go to Admin Dashboard
            </a>
          </div>

          {/* Chat with Data Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-[#506169] mb-4">
              Chat with the Data
            </h2>
            <p className="text-[#6e7f87] mb-4">
              Interact with processed data and get insights using AI-powered models.
            </p>
            <a
              href="/chat"
              className="bg-[#506169] text-white py-2 px-6 rounded-lg hover:bg-[#daf1f4] transition duration-300"
            >
              Chat with Data
            </a>
          </div>
        </div>
        
        {/* Background Information Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-semibold text-[#506169] mb-4">
            Learn More About LLL
          </h2>
          <p className="text-xl text-[#6e7f87] mb-4">
            LLL leverages large language models (LLM) to process and extract insights from documents in various formats like PDF, Word, and others.
          </p>
          <p className="text-[#6e7f87]">
            Our system empowers users to interact with documents intelligently and gain valuable insights through AI. Whether you're an admin, editor, or end user, LLL simplifies document management and data interaction.
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
