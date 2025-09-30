import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, DollarSign, BookOpen, Calendar, User, Pages, Award, ShoppingCart, Heart, Share2 } from 'lucide-react';
import DetailPage from '../components/UI/DetailPage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { publicService } from '../services/api';
import { findItemBySlug } from '../utils/slug';

interface Book {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  imageUrl: string;
  views: number;
  likes: number;
  price: number;
  rating: number;
  pages: number;
  publishedYear: number;
  isbn: string;
  publisher: string;
  language: string;
}

const BookDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const data = await publicService.getBooks();
          const bookData = findItemBySlug(data, slug!, 'slug', 'title');
          if (bookData) {
            const book: Book = {
              id: bookData.id?.toString() || slug!,
              title: bookData.title || 'Untitled Book',
              description: bookData.description || 'No description available.',
              content: bookData.content || bookData.summary || `
                <h2>Book Summary</h2>
                <p>This book provides comprehensive information about gardening techniques and practices.</p>
              `,
              author: bookData.author || 'Unknown Author',
              publishedAt: bookData.published_year ? `${bookData.published_year}-01-01` : bookData.created_at || new Date().toISOString(),
              tags: bookData.tags || bookData.categories || ['General'],
              imageUrl: bookData.image || bookData.imageUrl || 'https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg',
              views: bookData.views || 0,
              likes: bookData.likes || 0,
              price: bookData.price || 0,
              rating: bookData.rating || 4.0,
              pages: bookData.pages || 0,
              publishedYear: bookData.published_year || new Date().getFullYear(),
              isbn: bookData.isbn || 'N/A',
              publisher: bookData.publisher || 'Unknown Publisher',
              language: bookData.language || 'English'
            };
            setBook(book);
            return;
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          setError('Failed to load data from server');
          return;
        }
        
        // If no data found, set error
        setError('Data not found');
      } catch (err) {
        setError('Failed to load book');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBook();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-800 mb-4">Book not found</h1>
          <button
            onClick={() => navigate('/books')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetailPage
      type="book"
      title={book.title}
      description={book.description}
      content={book.content}
      author={book.author}
      publishedAt={book.publishedAt}
      tags={book.tags}
      imageUrl={book.imageUrl}
      views={book.views}
      likes={book.likes}
      backUrl="/books"
      rating={book.rating}
      price={book.price}
      category="Gardening"
      relatedContent={[
        { id: '2', title: 'The Vegetable Gardener\'s Bible', type: 'book', slug: 'vegetable-gardeners-bible' },
        { id: '3', title: 'Indoor Plant Care Guide', type: 'book', slug: 'indoor-plant-care-guide' },
        { id: '4', title: 'Seasonal Gardening Calendar', type: 'book', slug: 'seasonal-gardening-calendar' }
      ]}
    >
      {/* Book Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Book Details */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Book Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Pages:</span>
              <span className="text-blue-600">{book.pages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Published:</span>
              <span className="text-blue-600">{book.publishedYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Publisher:</span>
              <span className="text-blue-600">{book.publisher}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Language:</span>
              <span className="text-blue-600">{book.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">ISBN:</span>
              <span className="text-blue-600 text-sm">{book.isbn}</span>
            </div>
          </div>
        </div>

        {/* Price and Rating */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-emerald-800 mb-4">Pricing & Rating</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-emerald-800">${book.price}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-emerald-700 font-medium">{book.rating}/5</span>
              </div>
            </div>
            <div className="text-sm text-emerald-600">
              Author: <span className="font-semibold">{book.author}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-semibold">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart - ${book.price}
        </button>
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold">
          <BookOpen className="h-5 w-5 mr-2" />
          Read Sample
        </button>
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold">
          <Heart className="h-5 w-5 mr-2" />
          Add to Wishlist
        </button>
        <button className="flex-1 flex items-center justify-center px-6 py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-semibold">
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </button>
      </motion.div>
    </DetailPage>
  );
};

export default BookDetail;
