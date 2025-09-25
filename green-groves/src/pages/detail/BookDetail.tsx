import React from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, BookOpen, Star, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContent } from '../../hooks/useContent';
import { Book } from '../../types/content';
import DetailLayout from '../../components/Detail/DetailLayout';
import { ROUTES } from '../../constants';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const { getById } = useContent<Book>('books');
  
  const book = getById(id!);

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Book not found</h2>
        <p className="text-gray-500">The book you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <DetailLayout
      title={book.title}
      description={book.description}
      imageUrl={book.imageUrl}
      backLink={ROUTES.BOOKS}
      backLabel="Books"
      author={book.author}
      createdAt={book.createdAt}
      category={book.category}
      rating={book.rating}
    >
      <div className="space-y-8">
        {/* Book Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Book Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Author:</span>
                <span>{book.author}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span className="text-emerald-600 font-bold">${book.price}</span>
              </div>
              {book.isbn && (
                <div className="flex justify-between">
                  <span className="font-medium">ISBN:</span>
                  <span className="text-sm">{book.isbn}</span>
                </div>
              )}
              {book.publisher && (
                <div className="flex justify-between">
                  <span className="font-medium">Publisher:</span>
                  <span>{book.publisher}</span>
                </div>
              )}
              {book.publishedYear && (
                <div className="flex justify-between">
                  <span className="font-medium">Year:</span>
                  <span>{book.publishedYear}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex justify-between">
                  <span className="font-medium">Pages:</span>
                  <span>{book.pages}</span>
                </div>
              )}
            </div>
          </div>

          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-yellow-50'
          } shadow-lg`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
            }`}>
              Rating & Reviews
            </h3>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(book.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold">{book.rating}/5</span>
            </div>
            <p className="text-sm">Based on reader reviews and expert recommendations</p>
          </div>
        </div>

        {/* Description */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            About This Book
          </h3>
          <p className="text-lg leading-relaxed">{book.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={book.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-colors shadow-lg"
          >
            <ExternalLink className="h-5 w-5" />
            <span>Buy Now - ${book.price}</span>
          </a>
          
          {book.borrowLink && (
            <a
              href={book.borrowLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg ${
                isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Borrow from Library</span>
            </a>
          )}
        </div>
      </div>
    </DetailLayout>
  );
};

export default BookDetail;