import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ExternalLink, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '../hooks/useContent';
import { Book } from '../types/content';
import { initialBooks } from '../data/initialData';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';

const Books: React.FC = () => {
  const { getPublished } = useContent<Book>('books', initialBooks);
  const books = getPublished();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recommended Books"
        subtitle="Expand your gardening knowledge with our carefully curated book recommendations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full group">
              <Link to={`/books/${book.id}`} className="block">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {book.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{book.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {book.title}
                </h3>
                
                <p className="text-gray-600 font-medium mb-3">by {book.author}</p>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {book.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-emerald-600 font-bold text-lg">
                    ${book.price}
                  </div>
                  {book.publishedYear && (
                    <div className="text-sm text-gray-500">
                      Published: {book.publishedYear}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="mr-1">View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No books available</h3>
          <p className="text-gray-500">Check back later for new book recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default Books;