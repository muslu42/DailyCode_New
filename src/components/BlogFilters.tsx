import React from 'react';
import { Filter, SortDesc, SortAsc, Search } from 'lucide-react';
import { Category, FilterOptions } from '../types';

interface BlogFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableTags: string[];
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  filters,
  onFilterChange,
  availableTags,
}) => {
  const categories: Category[] = ['Yazı', 'Şiir', 'Anı', 'Deneme'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="w-4 h-4 inline mr-2" />
            Kategori
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                category: (e.target.value || undefined) as Category,
              })
            }
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filters.sortBy === 'newest' ? (
              <SortDesc className="w-4 h-4 inline mr-2" />
            ) : (
              <SortAsc className="w-4 h-4 inline mr-2" />
            )}
            Sıralama
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as 'newest' | 'oldest',
              })
            }
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
          </select>
        </div>

        <div className="flex-[2] min-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="w-4 h-4 inline mr-2" />
            Etiketler
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const newTags = filters.searchTags.includes(tag)
                    ? filters.searchTags.filter((t) => t !== tag)
                    : [...filters.searchTags, tag].slice(0, 5);
                  onFilterChange({ ...filters, searchTags: newTags });
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.searchTags.includes(tag)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};