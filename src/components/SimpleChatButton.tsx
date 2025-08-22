import React, { useState } from 'react';

const SimpleChatButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleChatClick = () => {
    alert('🤖 AI Chat Feature\n\nHi! I\'m Oscar\'s AI assistant. This chat demonstrates:\n\n• Real-time messaging capabilities\n• Smart auto-responses\n• Interactive user experience\n• Full-stack development skills\n\nTry asking:\n• "Tell me about your skills"\n• "I\'m interested in hiring you"\n• "What projects have you built?"\n\nThis showcases the kind of interactive features Oscar builds for clients!');
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleChatClick}
      style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        backgroundColor: '#2563eb',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)',
        border: '3px solid white',
        fontSize: '28px',
        color: 'white',
        transition: 'all 0.3s ease',
        animation: 'bounce 2s infinite'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.backgroundColor = '#1d4ed8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = '#2563eb';
      }}
    >
      💬
      <div
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          animation: 'pulse 1.5s infinite'
        }}
      >
        AI
      </div>
      
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleChatButton;