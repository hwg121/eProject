import React from 'react';
import { BookOpen, ExternalLink, Star } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import Carousel from '../components/UI/Carousel';
import { books } from '../data/mockData';

const Books: React.FC = () => {

  const featuredBooks = [
    {
      id: '1',
      title: 'The Well-Tended Perennial Garden',
      description: 'A comprehensive guide to creating and maintaining beautiful perennial gardens that bloom year after year.',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
      badge: 'Bestseller',
      link: '#'
    },
    {
      id: '2',
      title: 'Square Foot Gardening Revolution',
      description: 'Maximize your harvest in minimal space with this innovative gardening method that\'s perfect for beginners.',
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
      badge: 'Beginner Friendly',
      link: '#'
    },
    {
      id: '3',
      title: 'The Hidden Life of Trees',
      description: 'Discover the fascinating secret world of trees and how they communicate, nurture, and support each other.',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
      badge: 'Award Winner',
      link: '#'
    }
  ];
  const additionalBooks = [
    {
      id: 3,
      title: "The Hidden Life of Trees",
      author: "Peter Wohlleben",
      description: "Discover the fascinating social life and complex communication networks of trees.",
      buyLink: "https://example.com/buy", 
      borrowLink: "https://example.com/borrow",
      image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg",
      rating: 4.8,
      category: "Nature Science",
      price: 24.95
    },
    {
      id: 4,
      title: "Botany for Gardeners",
      author: "Brian Capon",
      description: "Understanding plant science to become a better gardener.",
      buyLink: "https://example.com/buy",
      borrowLink: "https://example.com/borrow",
      image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg",
      rating: 4.6,
      category: "Plant Science"
    },
    {
      id: 5,
      title: "The Vegetable Gardener's Bible",
      author: "Edward C. Smith",
      description: "The complete guide to growing vegetables using the W-O-R-D system.",
      buyLink: "https://example.com/buy",
      borrowLink: "https://example.com/borrow",
      image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg",
      rating: 4.7,
      category: "Vegetable Gardening"
    },
    {
      id: 6,
      title: "Native Plants of the Southeast",
      author: "Larry Mellichamp",
      description: "A comprehensive field guide to native plants and their benefits.",
      buyLink: "https://example.com/buy",
      borrowLink: "https://example.com/borrow",
      image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg",
      rating: 4.5,
      category: "Native Plants"
    }
  ];

  const allBooks = [...books.map(book => ({...book, rating: 4.5, category: "General"})), ...additionalBooks];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allBooks.map((book) => (
          <Card key={book.id} className="h-full">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center justify-between mb-2">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                {book.category}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-emerald-800">{book.rating}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">{book.title}</h3>
            <p className="text-emerald-600 font-medium mb-3">by {book.author}</p>
            <p className="text-emerald-600 mb-4 leading-relaxed">{book.description}</p>
            {book.price && (
              <div className="mb-4">
                <span className="text-lg font-bold text-emerald-800">${book.price}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 mt-auto">
              <a
                href={book.buyLink}
                className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Buy Online</span>
              </a>
              <a
                href={book.borrowLink}
                className="flex items-center justify-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="h-4 w-4" />
                <span>Borrow</span>
              </a>
            </div>
          </Card>
        ))}
      </div>

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