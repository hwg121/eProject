import React, { useState, useEffect } from 'react';
import { Wrench, Clock, Mail } from 'lucide-react';
import { formatMaintenanceEstimate } from '../utils/dateUtils';

interface MaintenancePageProps {
  message?: string;
  estimatedEndAt?: string;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ 
  message = 'We are currently performing scheduled maintenance to improve our services. Please check back soon.',
  estimatedEndAt 
}) => {
  // State for real-time countdown update
  const [countdownText, setCountdownText] = useState<string>('');

  // Update countdown every minute
  useEffect(() => {
    if (!estimatedEndAt) return;

    const updateCountdown = () => {
      const formatted = formatMaintenanceEstimate(estimatedEndAt);
      setCountdownText(formatted);
    };

    // Initial update
    updateCountdown();

    // Update every 60 seconds
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [estimatedEndAt]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_rgba(16,185,129,0.2)] p-6 md:p-12 text-center border border-green-200/60">
          
          {/* Green Groves Branding */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-green-600 mb-1 tracking-wider">
              GREEN GROVES
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto"></div>
          </div>

          {/* Icon Section */}
          <div className="mb-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-green-300/50 to-emerald-300/50 rounded-full blur-2xl"></div>

            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-ping" style={{ animationDuration: '8s' }}></div>
              <div className="absolute inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-30 animate-ping" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>

              <div className="relative w-20 h-20 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-full shadow-xl shadow-green-400/30 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
                <Wrench className="w-10 h-10 text-green-600 relative z-10 drop-shadow-lg" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-3 mb-6">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent tracking-tight leading-tight drop-shadow-sm">
              System Maintenance
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-green-400 rounded-full"></div>
              <div className="h-1 w-24 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full shadow-lg shadow-green-400/50"></div>
              <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-teal-400 rounded-full"></div>
            </div>
          </div>

          {/* Message */}
          <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto font-light">
            {message}
          </p>

          {/* Estimated Time */}
          {estimatedEndAt && countdownText && (
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-6 py-3 rounded-full text-green-700 mb-8 border border-green-300/60 shadow-lg shadow-green-200/50 backdrop-blur-sm">
              <div className="relative">
                <Clock className="w-5 h-5 animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute inset-0 animate-ping opacity-30" style={{ animationDuration: '10s' }}>
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <span className="text-base font-semibold">{countdownText}</span>
            </div>
          )}

          {/* Contact Support */}
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
            <div className="pt-8">
              <p className="text-gray-500 mb-4 text-xs uppercase tracking-widest font-semibold">Need urgent assistance?</p>
              <a
                href="mailto:support@greengroves.blog"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 relative overflow-hidden text-sm md:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <Mail className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Contact Support</span>
              </a>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="mt-8 text-center space-y-3">
            <div className="inline-flex gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce shadow-lg shadow-green-400/60" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/60" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce shadow-lg shadow-teal-400/60" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-green-600/70 text-sm font-semibold tracking-wide">Updating our systems...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
