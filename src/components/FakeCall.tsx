import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, User, Volume2, Mic, MessageSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FakeCallProps {
  isActive: boolean;
  onEnd: () => void;
}

const FakeCall: React.FC<FakeCallProps> = ({ isActive, onEnd }) => {
  const { isDark } = useTheme();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [contactName] = useState('Mom');
  const [callStatus, setCallStatus] = useState('Calling...');

  
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setCallStatus('Connected');
      }, 2000);

      const durationTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(durationTimer);
      };
    }
  }, [isActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-600 to-purple-800'} text-white`}>
      <div className="flex flex-col items-center justify-between h-full px-8 py-12">
        
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <User className="w-16 h-16 text-white" />
            </div>
            
            {callStatus === 'Calling...' && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping opacity-0"></div>
                <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-0" style={{ animationDelay: '0.5s' }}></div>
              </>
            )}
          </div>
          
          <h2 className="text-3xl font-bold mb-1">{contactName}</h2>
          <p className={`text-lg ${callStatus === 'Connected' ? 'text-green-300' : 'text-white/80'}`}>
            {callStatus}
          </p>
          
          {callStatus === 'Connected' && (
            <div className="mt-4">
              <div className="text-3xl font-light mb-2">{formatDuration(callDuration)}</div>
              <div className="flex items-center justify-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${callStatus === 'Connected' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm">Secure Connection</span>
              </div>
            </div>
          )}
        </div>

        
        <div className="w-full max-w-md">
          <div className="grid grid-cols-3 gap-4 mb-8">
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex flex-col items-center p-3 rounded-full transition-all ${isMuted ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <Mic className="w-6 h-6 mb-1" />
              <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            
            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`flex flex-col items-center p-3 rounded-full transition-all ${isSpeaker ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <Volume2 className="w-6 h-6 mb-1" />
              <span className="text-xs">{isSpeaker ? 'Speaker On' : 'Speaker'}</span>
            </button>

            
            <button className="flex flex-col items-center p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
              <MessageSquare className="w-6 h-6 mb-1" />
              <span className="text-xs">Keypad</span>
            </button>
          </div>

          
          <button
            onClick={onEnd}
            className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
          >
            <PhoneOff className="w-6 h-6 mr-2" />
            <span className="font-medium">End Call</span>
          </button>
        </div>

        
        <div className="text-center mt-6">
          <p className="text-sm text-white/60">
            This is a simulated call for safety purposes
          </p>
          <p className="text-xs text-white/40 mt-1">
            Your real contacts will not be notified
          </p>
        </div>
      </div>
    </div>
  );
};

export default FakeCall;