import React, { useState } from 'react';
import { assets } from '../../assets/assets';

const faqData = [
  {
    question: 'What is this LMS?',
    answer:
      'This Learning Management System is a web platform where instructors can create and publish online courses, and students can enroll, watch video lectures, track their progress, and rate courses.',
  },
  {
    question: 'Who can use the LMS?',
    answer:
      'There are two main types of users: students, who browse and enroll in courses, and instructors, who create and manage courses and view student enrollments and progress.',
  },
  {
    question: 'Do I need an account to enroll in a course?',
    answer:
      'Yes. You need to sign up and log in to enroll in courses, access purchased content, track your progress, and submit ratings.',
  },
  {
    question: 'Do I get lifetime access after enrolling in a course?',
    answer:
      'Yes. After a successful payment, you get lifetime access to the course, including future updates made by the instructor.',
  },
  {
    question: 'Can I watch a preview before enrolling?',
    answer:
      'Yes. Selected lectures are marked as free preview. You can watch these preview lectures on the course details page before deciding to enroll.',
  },
  {
    question: 'How do I become an instructor?',
    answer:
      'Create an account and log in as a normal user first. Then use the “Become an Instructor” option in the application. Once your role is updated, you will get access to the instructor dashboard to create and manage courses.',
  },
  {
    question: 'How are payments handled?',
    answer:
      'Payments are processed securely through Stripe. After a successful checkout, the system automatically enrolls you in the selected course and your enrollment will appear in “My Enrollments”.',
  },
  {
    question: 'My payment succeeded but the course is not showing. What should I do?',
    answer:
      'First refresh the page or log out and log back in. If the course still does not appear in “My Enrollments”, contact support with your payment reference so we can verify and update your enrollment.',
  },
  {
    question: 'How is course progress tracked?',
    answer:
      'When you watch lectures, the system updates your course progress by marking completed lectures. You can see your progress inside the player and in your enrolled courses list.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. Authentication is handled through a secure identity provider and payments are processed by Stripe. Sensitive payment data is not stored directly in the LMS database.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="md:px-36 px-8 md:py-20 py-10 bg-gray-50 text-left">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
          Find quick answers to common questions about using the LMS as a student or an instructor.
        </p>

        <div className="space-y-3">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-gray-200 bg-white rounded shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex items-center justify-between px-4 py-3 md:py-4 text-left"
                >
                  <span className="font-medium text-gray-800 md:text-base text-sm">
                    {item.question}
                  </span>
                  <span
                    className={`transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <img
                      src={assets.down_arrow_icon}
                      alt="Toggle answer"
                      className="w-4 h-4"
                    />
                  </span>
                </button>

                <div
                  className={`px-4 pb-3 md:pb-4 text-sm md:text-base text-gray-600 transition-all duration-200 ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
