import React from 'react';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';
import { Heart } from 'lucide-react';
import { MediaItem } from '../types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface MediaGalleryProps {
  items: MediaItem[];
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="p-2">
            {item.type === 'image' ? (
              <div className="relative group">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                    <p className="text-white text-lg font-semibold">{item.title}</p>
                    {item.description && (
                      <p className="text-white/80 text-sm">{item.description}</p>
                    )}
                  </div>
                )}
              </div>
            ) : item.type === 'video' ? (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <ReactPlayer
                  url={item.url}
                  width="100%"
                  height="400px"
                  controls
                  light
                />
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-center h-[300px]">
                  <Heart className="w-16 h-16 text-pink-500 animate-pulse" />
                </div>
                <audio src={item.url} controls className="w-full mt-4" />
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};