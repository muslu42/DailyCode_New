import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Edit } from 'lucide-react'; // Edit icon ekledik
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Düzenleme modunu kontrol etmek için bir state
  const [updatedContent, setUpdatedContent] = useState(''); // Düzenlenmiş içerik

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
      setUpdatedContent(data.content); // Başlangıçta içerik ile güncelle
    } catch (err) {
      console.error('Post fetch error:', err);
      setError('İçerik yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const handleSave = async () => {
    if (!updatedContent) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ content: updatedContent })
        .eq('id', id);

      if (error) throw error;
      setPost((prevPost) => prevPost ? { ...prevPost, content: updatedContent } : prevPost); // Güncellenmiş içeriği state'e yansıt
      setIsEditing(false); // Düzenleme modunu kapat
    } catch (err) {
      console.error('Error saving post:', err);
      setError('İçeriği kaydederken bir sorun oluştu.');
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>İçerik yükleniyor...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>{error || 'İçerik bulunamadı.'}</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-indigo-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Ana Sayfaya Dön
      </Link>

      <img
        src={post.cover_image}
        alt={post.title}
        className="w-full aspect-video object-cover rounded-lg shadow-lg mb-8"
      />

      <div className="flex items-center gap-4 mb-6">
        <span className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full">
          {post.category}
        </span>
        <div className="flex items-center text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(post.publish_date).toLocaleDateString('tr-TR')}
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

      {/* Düzenleme butonunu burada ekliyoruz */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center text-indigo-600 hover:underline mb-4"
        >
          <Edit className="w-4 h-4 mr-2" />
          Düzenle
        </button>
      )}

      {isEditing ? (
        <div className="mb-8">
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="w-full h-60 p-4 border border-gray-300 rounded-lg"
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Kaydet
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Vazgeç
            </button>
          </div>
        </div>
      ) : (
        <div className="prose prose-lg max-w-none mb-8">
          {formatContent(post.content)}
        </div>
      )}

      <div className="flex gap-2 border-t pt-6">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};
