import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard as Edit, Trash2, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { BaseContent } from '../../types/content';

interface ContentTableProps<T extends BaseContent> {
  items: T[];
  columns: TableColumn<T>[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  getDetailLink: (id: string) => string;
}

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

function ContentTable<T extends BaseContent>({
  items,
  columns,
  onEdit,
  onDelete,
  getDetailLink
}: ContentTableProps<T>) {
  const { isDarkMode } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={`text-left py-4 px-4 font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {column.label}
              </th>
            ))}
            <th className={`text-left py-4 px-4 font-semibold ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <motion.tr
              key={item.id}
              className={`border-b hover:bg-opacity-50 transition-colors ${
                isDarkMode 
                  ? 'border-gray-700 hover:bg-gray-800' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {columns.map((column) => (
                <td key={column.key as string} className="py-4 px-4">
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </td>
              ))}
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <Link
                    to={getDetailLink(item.id)}
                    className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <motion.button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No items found.
          </p>
        </div>
      )}
    </div>
  );
}

export default ContentTable;