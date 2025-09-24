import React, { useState } from 'react';
import { Play, Clock, User } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';

const Videos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videos = [
    {
      id: 1,
      title: "Container Gardening for Beginners",
      description: "Learn the basics of growing plants in containers with this comprehensive guide.",
      duration: "12:45",
      instructor: "Sarah Green",
      thumbnail: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "Pruning Techniques for Healthy Plants",
      description: "Master the art of pruning to promote healthy growth and beautiful blooms.",
      duration: "18:30",
      instructor: "Mike Garden",
      thumbnail: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 3,
      title: "Composting Made Simple",
      description: "Create nutrient-rich compost for your garden with kitchen scraps and yard waste.",
      duration: "15:20",
      instructor: "Emma Nature",
      thumbnail: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 4,
      title: "Indoor Herb Garden Setup",
      description: "Grow fresh herbs year-round with this indoor gardening setup tutorial.",
      duration: "10:15",
      instructor: "James Herbs",
      thumbnail: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 5,
      title: "Organic Pest Control Methods",
      description: "Natural ways to protect your plants from pests without harmful chemicals.",
      duration: "14:50",
      instructor: "Lisa Organic",
      thumbnail: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 6,
      title: "Seasonal Garden Planning",
      description: "Plan your garden throughout the seasons for continuous harvests and blooms.",
      duration: "22:10",
      instructor: "David Seasons",
      thumbnail: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Educational Videos"
        subtitle="Learn from expert gardeners with our collection of instructional videos"
        icon={<Play className="h-10 w-10" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <Card key={video.id} className="h-full cursor-pointer" hover={true}>
            <div className="relative mb-4" onClick={() => setSelectedVideo(video.videoUrl)}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg hover:bg-opacity-30 transition-all duration-300">
                <Play className="h-16 w-16 text-white opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {video.duration}
              </div>
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">{video.title}</h3>
            <p className="text-emerald-600 mb-4 leading-relaxed">{video.description}</p>
            <div className="flex items-center text-sm text-emerald-500 mt-auto">
              <User className="h-4 w-4 mr-1" />
              <span>{video.instructor}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-5xl w-full max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-emerald-800">Educational Video</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-emerald-600 hover:text-emerald-800 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={selectedVideo}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Educational gardening video"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Categories */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
        <h3 className="text-2xl font-bold mb-6">📹 Video Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">🌱 Beginner Basics</h4>
            <ul className="space-y-1 text-purple-100">
              <li>• Getting started with gardening</li>
              <li>• Essential tools overview</li>
              <li>• Understanding soil types</li>
              <li>• Watering techniques</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🌿 Advanced Techniques</h4>
            <ul className="space-y-1 text-purple-100">
              <li>• Grafting and propagation</li>
              <li>• Season extension methods</li>
              <li>• Integrated pest management</li>
              <li>• Specialized growing systems</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">🏠 Indoor Gardening</h4>
            <ul className="space-y-1 text-purple-100">
              <li>• Houseplant care guides</li>
              <li>• Hydroponic setups</li>
              <li>• Grow light systems</li>
              <li>• Air plant arrangements</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <h3 className="text-2xl font-bold mb-4">💡 Quick Video Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">⏰ Time-Saving Tips</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Watch at 1.25x speed for efficiency</li>
              <li>• Take notes on key timestamps</li>
              <li>• Bookmark favorite videos</li>
              <li>• Practice alongside the video</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">📝 Learning Best Practices</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Start with beginner videos</li>
              <li>• Rewatch complex techniques</li>
              <li>• Apply knowledge immediately</li>
              <li>• Join discussion communities</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Videos;