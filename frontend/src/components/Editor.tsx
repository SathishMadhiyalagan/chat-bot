import React, { useState } from "react";
import Uploading from "./Uploading";
import UploadingList from "./UploadingList";

export default function Editor() {
  const [activeTab, setActiveTab] = useState("uploading"); // Default tab

  return (
    <div className="max-w-4xl mx-auto p-6 w-full">
      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 border-b-2 border-gray-300">
        <button
          onClick={() => setActiveTab("uploading")}
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === "uploading"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Uploading
        </button>
        <button
          onClick={() => setActiveTab("uploadingList")}
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === "uploadingList"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Uploading List
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "uploading" && <Uploading />}
        {activeTab === "uploadingList" && <UploadingList />}
      </div>
    </div>
  );
}
