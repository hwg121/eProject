import { useState, useEffect } from 'react';
import { BaseContent } from '../types/content';

export function useContent<T extends BaseContent>(
  contentType: string,
  initialData: T[] = []
) {
  const [items, setItems] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStorageKey = (type: string) => `greengroves_${type}`;

  useEffect(() => {
    const savedData = localStorage.getItem(getStorageKey(contentType));
    if (savedData) {
      try {
        setItems(JSON.parse(savedData));
      } catch (err) {
        console.error('Error loading saved data:', err);
        setItems(initialData);
      }
    } else {
      setItems(initialData);
    }
  }, [contentType]);

  const saveToStorage = (data: T[]) => {
    localStorage.setItem(getStorageKey(contentType), JSON.stringify(data));
  };

  const create = (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveToStorage(updatedItems);
    return newItem;
  };

  const update = (id: string, updates: Partial<T>) => {
    const updatedItems = items.map(item =>
      item.id === id
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    );
    setItems(updatedItems);
    saveToStorage(updatedItems);
  };

  const remove = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    saveToStorage(updatedItems);
  };

  const getById = (id: string) => {
    return items.find(item => item.id === id);
  };

  const getPublished = () => {
    return items.filter(item => item.status === 'published');
  };

  return {
    items,
    loading,
    error,
    create,
    update,
    remove,
    getById,
    getPublished,
  };
}