import React, { useState, useEffect } from 'react';
import './MessagesReceived.css'
const MessagesReceived = () => {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3003/api/contact')  // This is the updated contact route
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error('Error fetching messages:', error));
  }, []);

  const handleReply = async (messageId) => {
    // Assuming there is a reply route to handle the reply, add a POST request for replies
    try {
      await fetch('http://localhost:3003/api/reply', {  // Assuming you have a reply route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          username: messages.find((msg) => msg._id === messageId).username,
          replyText,
        }),
      });
      alert('Reply sent successfully!');
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  return (
    <div className="messages-received">
      <h1 className='messages'>Messages Received</h1>
      <ul>
        {messages.map((message) => (
          <li key={message._id}>
            <p><strong>From:</strong> {message.username}</p>
            <p><strong>Message:</strong> {message.message}</p>
            <textarea
              value={selectedMessageId === message._id ? replyText : ''}
              onChange={(e) => {
                setReplyText(e.target.value);
                setSelectedMessageId(message._id);
              }}
              placeholder="Write your reply..."
            />
            <button onClick={() => handleReply(message._id)}>Send Reply</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesReceived;
