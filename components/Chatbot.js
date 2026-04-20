'use client';

import { useState, useRef, useEffect } from 'react';

const BOT_RESPONSES = {
  greeting: "Hi! 👋 Welcome to Sparkline Auto. I can help you with pricing, services, booking, and more. What would you like to know?",
  price: "Our services start at:\n• Exterior Wash: ₹499\n• Interior Detail: ₹799\n• Paint Correction: ₹4,999\n• Ceramic Coating: ₹9,999\n• Full Package: ₹2,999\n\nWant exact pricing for your car?",
  booking: "Booking is easy! You can:\n1. Use our online booking form above ↑\n2. Call us at 8123823193\n3. DM us on Instagram @its_vinu29\n\nShall I take you to the booking form?",
  location: "We offer TWO options:\n🏠 Doorstep Service — we come to you anywhere in Bengaluru\n🏢 Service Center — drop off your car\n\nWhich do you prefer?",
  ceramic: "Ceramic coating is our most popular service! 🌟\n• 9H hardness nano-ceramic\n• 3–5 year protection\n• Self-cleaning hydrophobic effect\n• Prices from ₹9,999\n\nWant to book a ceramic coating appointment?",
  time: "Our working hours:\n🕘 Monday–Saturday: 9 AM – 6 PM\n📅 Sunday: By appointment only\n\nWant to book a slot right now?",
  ppf: "Paint Protection Film (PPF) shields your paint from:\n✓ Stone chips & scratches\n✓ Bird droppings & UV\n✓ Self-healing on minor marks\n\nPrices start at ₹14,999. Book a consultation today!",
  doorstep: "Yes! 🏠 We offer doorstep service across Bengaluru.\nSimply select 'Doorstep' when booking and share your address. We'll come to you — home, office, anywhere!",
  warranty: "We stand behind our work!\n• Ceramic coating: 3–5 year warranty\n• PPF: Manufacturer warranty included\n• All services: Satisfaction guarantee\n\nNot happy? We'll fix it free.",
  contact: "You can reach us at:\n📞 8123823193\n✉️ vinayakaj29@gmail.com\n📸 Instagram: @its_vinu29\n\nWe typically respond within 2 hours!",
  default: "I'd love to help! For detailed questions, please call us at 📞 8123823193 or use our contact form. Our team is available Mon–Sat, 9 AM–6 PM.",
};

function getBotReply(input) {
  const msg = input.toLowerCase();
  if (msg.match(/hello|hi|hey|start|help/)) return BOT_RESPONSES.greeting;
  if (msg.match(/price|cost|rate|how much|charge|rupee|₹/)) return BOT_RESPONSES.price;
  if (msg.match(/book|appointment|schedule|slot/)) return BOT_RESPONSES.booking;
  if (msg.match(/location|where|address|center/)) return BOT_RESPONSES.location;
  if (msg.match(/ceramic|coating/)) return BOT_RESPONSES.ceramic;
  if (msg.match(/time|hours|open|when/)) return BOT_RESPONSES.time;
  if (msg.match(/ppf|film|protection film/)) return BOT_RESPONSES.ppf;
  if (msg.match(/doorstep|home|deliver|come to/)) return BOT_RESPONSES.doorstep;
  if (msg.match(/warrant|guarantee/)) return BOT_RESPONSES.warranty;
  if (msg.match(/contact|phone|email|call/)) return BOT_RESPONSES.contact;
  return BOT_RESPONSES.default;
}

const QUICK_REPLIES = ['Pricing 💰','Book Now 📅','Doorstep? 🏠','Ceramic Coating ✨','Working Hours ⏰','Contact Us 📞'];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: BOT_RESPONSES.greeting, bot: true, time: new Date() }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [open]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setUnread(1), 5000);
      return () => clearTimeout(t);
    }
  }, []);

  const send = (text = input) => {
    if (!text.trim()) return;
    const userMsg = { text, bot: false, time: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = getBotReply(text);
      setMessages(m => [...m, { text: reply, bot: true, time: new Date() }]);
      if (!open) setUnread(n => n + 1);
    }, 900 + Math.random() * 500);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const scrollToBooking = () => { document.getElementById('booking')?.scrollIntoView({ behavior:'smooth' }); setOpen(false); };

  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setOpen(!open)} style={{
        position:'fixed', bottom:24, right:24, zIndex:9000,
        width:56, height:56, borderRadius:'50%',
        background:open ? '#333' : 'var(--crimson)',
        border:'none', cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:22, boxShadow:'0 8px 30px rgba(192,57,43,0.5)',
        transition:'all 0.3s', transform: open ? 'rotate(45deg)' : 'none',
      }}>
        {open ? '✕' : '💬'}
        {!open && unread > 0 && (
          <div style={{ position:'absolute', top:-2, right:-2, width:18, height:18, background:'#f0b429', borderRadius:'50%', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', color:'#000' }}>{unread}</div>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position:'fixed', bottom:90, right:24, zIndex:8999,
          width:340, maxHeight:520, borderRadius:12, overflow:'hidden',
          background:'#111', border:'1px solid var(--border)',
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
          display:'flex', flexDirection:'column', animation:'slideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{ background:'var(--crimson-dark)', padding:'14px 16px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
            <div>
              <div style={{ fontWeight:700, fontSize:14 }}>Sparkline Assistant</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#2ea043', display:'inline-block' }} />
                Online · Usually replies instantly
              </div>
            </div>
            <button onClick={()=>setOpen(false)} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:16 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:'flex', justifyContent:msg.bot?'flex-start':'flex-end' }}>
                {msg.bot && <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--crimson-dark)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, flexShrink:0, marginRight:6, alignSelf:'flex-end' }}>SL</div>}
                <div style={{
                  background:msg.bot?'rgba(255,255,255,0.07)':'var(--crimson)',
                  padding:'9px 13px', borderRadius:msg.bot?'12px 12px 12px 2px':'12px 12px 2px 12px',
                  maxWidth:'80%', fontSize:13, lineHeight:1.6, whiteSpace:'pre-line',
                  color:'white'
                }}>
                  {msg.text}
                  {msg.text.includes('booking form') && (
                    <button onClick={scrollToBooking} style={{ display:'block', marginTop:8, padding:'5px 10px', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', color:'white', borderRadius:4, cursor:'pointer', fontSize:11, fontFamily:'var(--font-body)' }}>Go to Booking ↑</button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--crimson-dark)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>SL</div>
                <div style={{ background:'rgba(255,255,255,0.07)', padding:'10px 14px', borderRadius:'12px 12px 12px 2px' }}>
                  <span style={{ display:'flex', gap:4 }}>
                    {[0,1,2].map(i=><span key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#666', display:'inline-block', animation:`bounce 1.2s infinite ${i*0.2}s` }} />)}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div style={{ padding:'8px 12px', display:'flex', gap:6, overflowX:'auto', borderTop:'1px solid var(--border)', flexWrap:'nowrap' }}>
            {QUICK_REPLIES.map((r, i) => (
              <button key={i} onClick={()=>send(r)} style={{
                padding:'5px 10px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)',
                color:'#aaa', borderRadius:12, cursor:'pointer', fontSize:11, whiteSpace:'nowrap',
                fontFamily:'var(--font-body)', transition:'all 0.2s'
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--crimson)'; e.currentTarget.style.color='white';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='#aaa';}}>{r}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display:'flex', gap:8, padding:'10px 12px', borderTop:'1px solid var(--border)' }}>
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Ask anything..." style={{ flex:1, background:'rgba(255,255,255,0.07)', border:'1px solid var(--border)', color:'white', padding:'9px 12px', borderRadius:6, fontSize:13, fontFamily:'var(--font-body)', outline:'none' }} />
            <button onClick={()=>send()} style={{ padding:'9px 14px', background:'var(--crimson)', border:'none', color:'white', borderRadius:6, cursor:'pointer', fontSize:14 }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}
