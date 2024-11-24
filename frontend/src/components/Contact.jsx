import React from "react";
import Navbar from "./Navbar"; // Adjust the path as needed
import Footer from "./Footer";

export default function Contact() {
    return (
        <div className="bg-[#e5e7eb] min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Contact Page Content */}
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#e5e7eb]">
                <div className="w-full max-w-2xl p-8 space-y-6 bg-white shadow-lg rounded-lg">
                    <h2 className="text-3xl font-semibold text-center text-[#506169]">
                        Contact Me
                    </h2>
                    <p className="text-center text-[#6e7f87] text-lg">
                        Feel free to reach out to me for project inquiries or collaborations!
                    </p>
                </div>

                {/* About Me Section */}
                <div className="w-full max-w-3xl p-8 space-y-6 mt-8 bg-white shadow-lg rounded-lg">
                    <h3 className="text-2xl font-semibold text-center text-[#506169]">
                        About Me
                    </h3>
                    <p className="mt-2 text-sm text-[#6e7f87]">
                        My name is Sathish Madhiyalagan, and I have a total of 6.5 years of experience. Of which 3.7 years are in the IT industry, with experience in Python, Django, PHP, Laravel, React Native, React.js, HTML, CSS, JavaScript, and jQuery.
                    </p>
                    <p className="mt-2 text-sm text-[#6e7f87]">
                        I completed a course in Data Science and AI certification through UpGrad (Nov 2023 - Sep 2024). During the course, I learned essential tools such as Pandas, NumPy, Matplotlib, Scikit-learn, and basic NLP.
                    </p>
                    <p className="mt-4 text-sm text-[#506169] font-semibold">
                        You can reach me directly at:{" "}
                        <span className="text-[#506169] font-bold">+919585668615</span>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
