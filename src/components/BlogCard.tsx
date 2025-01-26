import React from 'react';
import { Calendar, Tag, BookOpen } from 'lucide-react';
import { BlogCardProps } from '../types';
import { Link } from 'react-router-dom';

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] duration-300">
      <img
        src={post.coverImage}  // cover_image doğru şekilde kullanılıyor
        alt={`Görsel: ${post.title}`}  // Erişilebilirlik için daha açıklayıcı bir alt metin
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full">
            {post.category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.publishDate).toLocaleDateString('tr-TR')}
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.summary}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <div key={tag} className="flex items-center text-sm text-gray-500">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </div>
            ))}
          </div>
          <Link
            to={`/post/${post.id}`}  // Link'in doğru çalıştığından emin olun
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Devamını Oku
          </Link>
        </div>
      </div>
    </div>
  );
};
