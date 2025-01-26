import React, { useState, useEffect } from 'react';
import { BlogCard } from './BlogCard';
import { BlogFilters } from './BlogFilters';
import { NewPostForm } from './NewPostForm';
import { AuthButton } from './AuthButton';
import { BlogPost, FilterOptions } from '../types';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'newest',
    searchTags: [],
  });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const availableTags = React.useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [posts]);

  useEffect(() => {
    fetchPosts();
    checkUser();
    
    // Supabase realtime subscription for posts
    const postsSubscription = supabase
      .channel('blog_posts_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        () => {
          fetchPosts(); // Refresh posts when any change occurs
        }
      )
      .subscribe();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authSubscription.unsubscribe();
      postsSubscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;

      const formattedPosts = data.map(post => ({
        id: post.id,
        title: post.title,
        summary: post.summary,
        category: post.category,
        content: post.content,
        coverImage: post.cover_image,
        publishDate: post.publish_date,
        tags: post.tags || []
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = async (post: Omit<BlogPost, 'id'>) => {
    if (!user) {
      alert('Lütfen önce giriş yapın');
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert([{
          ...post,
          user_id: user.id,
          publish_date: new Date().toISOString()
        }]);

      if (error) throw error;

      setShowNewPostForm(false);
      // fetchPosts() is no longer needed here as the realtime subscription will trigger automatically
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Yazı eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const filteredPosts = React.useMemo(() => {
    return posts
      .filter((post) => {
        // Kategori filtresi
        if (filters.category && post.category !== filters.category) {
          return false;
        }
        
        // Etiket filtresi
        if (filters.searchTags.length > 0) {
          // En az bir etiket eşleşmeli
          const hasMatchingTag = filters.searchTags.some(tag => 
            post.tags.includes(tag)
          );
          if (!hasMatchingTag) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.publishDate).getTime();
        const dateB = new Date(b.publishDate).getTime();
        return filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [posts, filters.category, filters.searchTags, filters.sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Yazıları</h1>
        <div className="flex gap-4">
          <AuthButton />
          {user && (
            <button
              onClick={() => setShowNewPostForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-5 h-5" />
              Yeni Yazı
            </button>
          )}
        </div>
      </div>

      <BlogFilters
        filters={filters}
        onFilterChange={setFilters}
        availableTags={availableTags}
      />
      
      {showNewPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <NewPostForm
              onSubmit={handleNewPost}
              onCancel={() => setShowNewPostForm(false)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Yazılar yükleniyor...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Henüz hiç yazı yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};