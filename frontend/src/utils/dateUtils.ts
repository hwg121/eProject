/**
 * Format a date string to a readable format
 * @param dateString - The date string to format
 * @param includeTime - Whether to include time in the output (default: true)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date | null | undefined, includeTime: boolean = true): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 */
export const getRelativeTime = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'N/A';
  }
};

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string | Date): boolean => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
};

/**
 * Check if a date is in the past
 */
export const isPast = (dateString: string | Date): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  } catch (error) {
    return false;
  }
};

/**
 * Format estimated end time for maintenance mode
 * Returns a human-readable string like "Back in 2h 30m" or "Very soon!"
 */
export const formatMaintenanceEstimate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) return '';
    
    const diff = date.getTime() - now.getTime();
    
    // If time has passed
    if (diff <= 0) return 'Very soon!';
    
    // Calculate time components
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format based on time remaining
    if (days > 0) {
      if (hours > 0) {
        return `Back in ${days}d ${hours}h`;
      }
      return `Back in ${days} day${days > 1 ? 's' : ''}`;
    }
    
    if (hours > 0) {
      if (minutes > 0) {
        return `Back in ${hours}h ${minutes}m`;
      }
      return `Back in ${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    if (minutes > 0) {
      return `Back in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    return 'Very soon!';
  } catch (error) {
    console.error('Error formatting maintenance estimate:', error);
    return '';
  }
};

/**
 * Get time remaining until a future date in milliseconds
 * Returns 0 if date is in the past
 */
export const getTimeRemaining = (dateString: string | Date | null | undefined): number => {
  if (!dateString) return 0;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) return 0;
    
    const diff = date.getTime() - now.getTime();
    return diff > 0 ? diff : 0;
  } catch (error) {
    console.error('Error getting time remaining:', error);
    return 0;
  }
};
