import React, { useState } from "react";

export default function Chatbot() {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your detailing assistant. How can I help?", bot: true }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;

    const userMessage = { text: input, bot: false };

    let botReply = "Thanks! Our team will assist you.";

    if (input.toLowerCase().includes("price"))
      botReply = "Our detailing services start at $99.";

    if (input.toLowerCase().includes("booking"))
      botReply = "You can book using the form on this page.";

    if (input.toLowerCase().includes("location"))
      botReply = "We are located in the city center.";

    const botMessage = { text: botReply, bot: true };

    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#111",
          color: "white",
          border: "none",
          padding: "15px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "18px"
        }}
      >
        💬
      </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 300,
            background: "white",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            padding: 15
          }}
        >
          <div style={{ height: 200, overflowY: "auto", marginBottom: 10 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.bot ? "left" : "right",
                  marginBottom: 8
                }}
              >
                <span
                  style={{
                    background: msg.bot ? "#eee" : "#111",
                    color: msg.bot ? "#000" : "#fff",
                    padding: "6px 10px",
                    borderRadius: 6,
                    display: "inline-block"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: 6,
                borderRadius: 6,
                border: "1px solid #ccc"
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: 5,
                background: "#111",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}