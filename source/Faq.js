import React from 'react';
import { Accordion } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FAQ.css';

const Faq = () => {
    const questions = [
        {
            question: "What is EchoEase?",
            answer: "EchoEase is an innovative smart home automation platform that allows users to control their devices with ease using voice commands and a user-friendly web interface."
        },
        {
            question: "How does voice control work?",
            answer: "Our system uses advanced voice recognition technology, allowing users to control their devices by issuing simple voice commands via connected microphones and devices."
        },
        {
            question: "Can I use EchoEase in my office or hotel?",
            answer: "Yes, EchoEase is versatile and can be used in various environments like offices, hotels, and homes, providing seamless automation for any space."
        },
        {
            question: "Is EchoEase secure?",
            answer: "Yes, we prioritize user security and ensure all communications and data are encrypted. User access is protected with login credentials, and no personal data is stored unnecessarily."
        },
        {
            question: "What devices are compatible with EchoEase?",
            answer: "EchoEase is compatible with a wide range of smart devices, including lights, thermostats, and security systems. Check our compatibility guide for a full list."
        }
    ];

    return (
        <div className="faq-container">
            <h2 className="faq-title">
                {/* <FontAwesomeIcon icon={faQuestionCircle} /> Frequently Asked Questions */}
                <i className="fas fa-question-circle"></i>  Frequently Asked Questions
            </h2>
            <Accordion defaultActiveKey="0">
                {questions.map((item, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                        <Accordion.Header>{item.question}</Accordion.Header>
                        <Accordion.Body>{item.answer}</Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
};

export default Faq;
