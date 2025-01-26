import React from 'react';
import { Heart, Music } from 'lucide-react';
import { ApologyMessage } from '../types';
import { MediaGallery } from './MediaGallery';

interface ApologyCardProps {
  message: ApologyMessage;
}

export const ApologyCard: React.FC<ApologyCardProps> = ({ message }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-pink-600 font-serif">{message.title}</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
          {message.message}
        </p>
      </div>

      {message.backgroundMusic && (
        <div className="flex justify-center">
          <button
            onClick={toggleMusic}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
          >
            <Music className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>{isPlaying ? 'Pause Music' : 'Play Music'}</span>
          </button>
          <audio
            ref={audioRef}
            src={message.backgroundMusic}
            loop
            className="hidden"
          />
        </div>
      )}

      <MediaGallery items={message.mediaItems} />

      <div className="flex justify-center pt-8">
        <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
      </div>
    </div>
  );
};