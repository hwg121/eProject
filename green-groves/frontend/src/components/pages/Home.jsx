import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chào Mừng Đến Với
              <span className="block text-green-300">Green Groves</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Khám phá thế giới làm vườn quy mô nhỏ với hướng dẫn chi tiết, 
              dụng cụ chuyên nghiệp và mẹo hay từ các chuyên gia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/articles"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Bắt Đầu Học Làm Vườn
              </Link>
              <Link
                to="/tools"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Xem Dụng Cụ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn Green Groves?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp mọi thứ bạn cần để bắt đầu hành trình làm vườn của mình
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hướng Dẫn Chi Tiết
              </h3>
              <p className="text-gray-600">
                Từ cơ bản đến nâng cao, chúng tôi có đầy đủ hướng dẫn cho mọi loại cây trồng
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dụng Cụ Chuyên Nghiệp
              </h3>
              <p className="text-gray-600">
                Danh sách dụng cụ cần thiết với video hướng dẫn sử dụng chi tiết
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Vật Liệu Chất Lượng
              </h3>
              <p className="text-gray-600">
                Gợi ý đất, phân bón, hạt giống và các vật liệu cần thiết khác
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Khám Phá Nội Dung
            </h2>
            <p className="text-lg text-gray-600">
              Chọn chủ đề bạn quan tâm để bắt đầu học hủng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/articles"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Kỹ Thuật Làm Vườn
                </h3>
                <p className="text-gray-600 text-sm">
                  Học các kỹ thuật cơ bản và nâng cao
                </p>
              </div>
            </Link>

            <Link
              to="/tools"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <span className="text-2xl">🔨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Dụng Cụ Làm Vườn
                </h3>
                <p className="text-gray-600 text-sm">
                  Khám phá các dụng cụ cần thiết
                </p>
              </div>
            </Link>

            <Link
              to="/essentials"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vật Liệu Cần Thiết
                </h3>
                <p className="text-gray-600 text-sm">
                  Đất, phân bón, hạt giống và hơn thế nữa
                </p>
              </div>
            </Link>

            <Link
              to="/videos"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <span className="text-2xl">🎥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Video Hướng Dẫn
                </h3>
                <p className="text-gray-600 text-sm">
                  Học qua video minh họa trực quan
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn Sàng Bắt Đầu Hành Trình Làm Vườn?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Tham gia cộng đồng Green Groves và khám phá thế giới làm vườn tuyệt vời
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/articles"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Xem Bài Viết Mới Nhất
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Liên Hệ Với Chúng Tôi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
