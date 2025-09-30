import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, Star, ArrowRight, DollarSign } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import Carousel from '../components/UI/Carousel';
import { publicService } from '../services/api.ts';
import { generateSlug } from '../utils/slug';

const Books: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await publicService.getBooks();
        setBooks(data);
      } catch (err) {
        setError('Failed to load books');
        console.error('Error loading books:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Featured books will be the first 3 books from the database
  const featuredBooks = books.slice(0, 3).map(book => ({
    id: book.id.toString(),
    title: book.title,
    description: book.description,
    image: book.image || '/image.png',
    badge: 'Featured',
    link: '#'
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Related Books"
        subtitle="Expand your gardening knowledge with our carefully curated book recommendations"
        icon={<BookOpen className="h-10 w-10" />}
      />

      {/* Featured Books Carousel */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">Featured Books</h2>
          <p className="text-emerald-600 text-lg">
            Must-read gardening books recommended by our experts
          </p>
        </div>
        
        <Carousel 
          items={featuredBooks}
          autoPlay={true}
          interval={7000}
          showDots={true}
          showArrows={true}
          className="shadow-xl"
        />
      </section>
      {/* Featured Books */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h2 className="text-2xl font-bold mb-4">📖 Editor's Book Picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Best for Beginners</h3>
            <p className="text-indigo-100">Square Foot Gardening - Simple method, maximum results</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Most Inspiring</h3>
            <p className="text-indigo-100">The Hidden Life of Trees - Nature's amazing secrets</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Most Practical</h3>
            <p className="text-indigo-100">The Vegetable Gardener's Bible - Proven growing system</p>
          </div>
        </div>
      </Card>

      {/* Books Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading books...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <Link key={book.id} to={`/book/${book.slug || generateSlug(book.title)}`} className="block h-full">
              <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={book.image || '/image.png'}
                    alt={book.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <ArrowRight className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-2 py-1 rounded text-sm font-medium">
                    ${book.price || '0'}
                  </div>
                </div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                  {book.category || 'General'}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-emerald-800">{book.rating || '4.5'}</span>
                </div>
              </div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {book.title}
                </h3>
              <p className="text-emerald-600 font-medium mb-3">by {book.author || 'Unknown Author'}</p>
                <p className="text-emerald-600 mb-4 leading-relaxed">
                  {book.description?.substring(0, 100) + '...'}
                </p>
                <div className="flex items-center justify-between text-sm text-emerald-500 mt-auto pt-4 border-t border-emerald-100">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{book.pages || 'N/A'} pages</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${book.price || '0'}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Book Categories */}
      <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
        <h3 className="text-2xl font-bold mb-6">📚 Book Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">🌱 Beginner Guides</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Square Foot Gardening</li>
              <li>• Container Gardening</li>
              <li>• Basic Plant Care</li>
              <li>• Tool Selection</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🥕 Vegetable Growing</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Organic Methods</li>
              <li>• Season Extension</li>
              <li>• Pest Management</li>
              <li>• Companion Planting</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🌸 Flower Gardening</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Perennial Gardens</li>
              <li>• Cut Flower Growing</li>
              <li>• Garden Design</li>
              <li>• Seasonal Color</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🌿 Specialized Topics</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Native Plant Gardening</li>
              <li>• Permaculture</li>
              <li>• Soil Science</li>
              <li>• Plant Botany</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Reading Tips */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <h3 className="text-2xl font-bold mb-4">📖 Reading & Learning Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-3">📝 Effective Reading</h4>
            <ul className="space-y-2 text-orange-100">
              <li>• Keep a gardening journal alongside</li>
              <li>• Mark pages with seasonal reminders</li>
              <li>• Practice techniques as you read</li>
              <li>• Join online book discussions</li>
              <li>• Create your own reference system</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🌱 Application Tips</h4>
            <ul className="space-y-2 text-orange-100">
              <li>• Start with one new technique at a time</li>
              <li>• Adapt advice to your climate</li>
              <li>• Take before/after photos</li>
              <li>• Share experiences with other gardeners</li>
              <li>• Build your personal library gradually</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Library Resources */}
      <Card className="border-2 border-emerald-200">
        <h3 className="text-2xl font-bold text-emerald-800 mb-4">📍 Find These Books</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-emerald-100 p-4 rounded-lg mb-3">
              <BookOpen className="h-8 w-8 text-emerald-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-emerald-800 mb-2">Local Libraries</h4>
            <p className="text-emerald-600 text-sm">Check your local library system for physical and digital copies</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 p-4 rounded-lg mb-3">
              <ExternalLink className="h-8 w-8 text-emerald-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-emerald-800 mb-2">Online Stores</h4>
            <p className="text-emerald-600 text-sm">Purchase from major online retailers and bookstores</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 p-4 rounded-lg mb-3">
              <Star className="h-8 w-8 text-emerald-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-emerald-800 mb-2">Book Swaps</h4>
            <p className="text-emerald-600 text-sm">Join local gardening groups for book exchanges</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Books;