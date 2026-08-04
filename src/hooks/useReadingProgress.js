import { useState, useEffect } from 'react';

export function useReadingProgress() {
  const [readChapters, setReadChapters] = useState(() => {
    try {
      const stored = localStorage.getItem('voices-read-progress');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const markAsRead = (id) => {
    if (!id) return;
    setReadChapters((prev) => {
      if (!prev.includes(id)) {
        const next = [...prev, id];
        localStorage.setItem('voices-read-progress', JSON.stringify(next));
        return next;
      }
      return prev;
    });
  };

  return { readChapters, markAsRead };
}
