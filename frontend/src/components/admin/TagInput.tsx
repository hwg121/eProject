import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Autocomplete, TextField, Chip, CircularProgress, Tooltip, FilterOptionsState, createFilterOptions } from '@mui/material';
import { Tag, Plus } from 'lucide-react';
import { tagService } from '../../services/api';

interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface TagInputProps {
  value: number[]; // Array of tag IDs
  onChange: (tagIds: number[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  label = 'Tags',
  placeholder = 'Select tags...',
  error,
  helperText,
  disabled = false,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Fetch all tags on mount
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      
      
      const response = await tagService.getAllAdmin({
        per_page: 500, // Increased limit for better search experience
        sortBy: 'name',
        sortOrder: 'asc',
      });
      
      
      // Handle both formats: 
      // 1. Full Laravel response: {success: true, data: [...]}
      // 2. Unwrapped response: [...] (array directly)
      let tagsData = null;
      
      if (Array.isArray(response)) {
        // Case 2: Response is already unwrapped array
        tagsData = response;
      } else if (response && response.success && response.data) {
        // Case 1: Full Laravel response
        tagsData = response.data;
      } else if (response && Array.isArray(response.data)) {
        // Case 3: Has data property but no success
        tagsData = response.data;
      }
      
      if (tagsData && Array.isArray(tagsData)) {
        setTags(tagsData);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Get selected tag objects from IDs - memoized to prevent unnecessary recalculations
  const selectedTags = useMemo(() => {
    return tags.filter(tag => value.includes(tag.id));
  }, [tags, value]);

  // Handle tag selection change - useCallback to prevent re-creation
  const handleChange = useCallback((_event: any, newValue: Tag[]) => {
    const tagIds = newValue.map(tag => tag.id);
    onChange(tagIds);
  }, [onChange]);

  // Custom filter options for better search (search in name, slug, and description)
  // Memoized to prevent re-creation on every render
  const filterOptions = useMemo(() => 
    createFilterOptions<Tag>({
      matchFrom: 'any',
      stringify: (option) => {
        // Search across name, slug, and description
        const searchString = [
          option.name,
          option.slug,
          option.description || ''
        ].join(' ').toLowerCase();
        return searchString;
      },
      trim: true,
    }), 
  []);

  // MUI TextField styles with green theme
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#10b981',
        },
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#10b981',
    },
  };

  return (
    <Autocomplete
      multiple
      options={tags}
      value={selectedTags}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      filterOptions={filterOptions}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={selectedTags.length === 0 ? (placeholder || 'Search and select tags...') : ''}
          error={!!error}
          helperText={error || helperText || 'Type to search by name, slug, or description'}
          sx={textFieldStyles}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <Tag className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Tooltip key={option.id} title={option.description || option.slug} arrow>
            <Chip
              label={option.name}
              {...getTagProps({ index })}
              sx={{
                backgroundColor: '#10b981',
                color: 'white',
                '& .MuiChip-deleteIcon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: 'white',
                  },
                },
              }}
            />
          </Tooltip>
        ))
      }
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <div className="flex items-start space-x-2 py-1">
            <Tag className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{option.name}</div>
              {option.description && (
                <div className="text-xs text-gray-500 truncate">{option.description}</div>
              )}
            </div>
          </div>
        </li>
      )}
      noOptionsText={
        <div className="text-center py-4">
          <Tag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            {inputValue ? `No tags found matching "${inputValue}"` : 'No tags available'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {inputValue ? 'Try a different search term' : 'Create tags in Tag Management'}
          </p>
        </div>
      }
      sx={{
        '& .MuiAutocomplete-tag': {
          margin: '2px',
        },
      }}
    />
  );
};

export default TagInput;

