import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip, CircularProgress, Tooltip } from '@mui/material';
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
      
      console.log('🔍 [TagInput] Step 1: Starting fetch tags...');
      alert('🔍 [TagInput] Step 1: Starting fetch tags...');
      
      const response = await tagService.getAllAdmin({
        per_page: 100,
        sortBy: 'name',
        sortOrder: 'asc',
      });
      
      console.log('🔍 [TagInput] Step 2: API Response received:', response);
      console.log('🔍 [TagInput] Response type:', typeof response);
      console.log('🔍 [TagInput] Response is array?', Array.isArray(response));
      console.log('🔍 [TagInput] Response.success:', response?.success);
      console.log('🔍 [TagInput] Response.data:', response?.data);
      
      alert(`🔍 [TagInput] Step 2: API Response received!\n\nType: ${typeof response}\nIs Array: ${Array.isArray(response)}\nHas Success: ${!!response?.success}\nHas Data: ${!!response?.data}\n\nCheck console for full response.`);
      
      // Handle both formats: 
      // 1. Full Laravel response: {success: true, data: [...]}
      // 2. Unwrapped response: [...] (array directly)
      let tagsData = null;
      
      if (Array.isArray(response)) {
        // Case 2: Response is already unwrapped array
        console.log('🔍 [TagInput] Step 3a: Response is direct array. Count:', response.length);
        alert(`🔍 [TagInput] Step 3a: Response is direct array!\n\nCount: ${response.length}\nFirst tag: ${response[0]?.name || 'N/A'}`);
        tagsData = response;
      } else if (response && response.success && response.data) {
        // Case 1: Full Laravel response
        console.log('🔍 [TagInput] Step 3b: Laravel format response. Count:', response.data.length);
        alert(`🔍 [TagInput] Step 3b: Laravel format response!\n\nCount: ${response.data.length}\nFirst tag: ${response.data[0]?.name || 'N/A'}`);
        tagsData = response.data;
      } else if (response && Array.isArray(response.data)) {
        // Case 3: Has data property but no success
        console.log('🔍 [TagInput] Step 3c: Has data property. Count:', response.data.length);
        alert(`🔍 [TagInput] Step 3c: Has data property!\n\nCount: ${response.data.length}\nFirst tag: ${response.data[0]?.name || 'N/A'}`);
        tagsData = response.data;
      }
      
      if (tagsData && Array.isArray(tagsData)) {
        console.log('🔍 [TagInput] Step 4: Setting tags. Count:', tagsData.length);
        console.log('🔍 [TagInput] First tag:', tagsData[0]);
        setTags(tagsData);
        alert(`✅ [TagInput] SUCCESS: Loaded ${tagsData.length} tags!\n\nFirst tag: ${tagsData[0]?.name || 'N/A'}\n\nTags loaded successfully!`);
      } else {
        console.warn('🔍 [TagInput] Step 4: Could not extract tags data');
        console.warn('🔍 [TagInput] Response type:', typeof response);
        console.warn('🔍 [TagInput] Full response:', response);
        console.warn('🔍 [TagInput] Response keys:', Object.keys(response || {}));
        alert(`⚠️ [TagInput] WARNING: Could not extract tags!\n\nResponse type: ${typeof response}\nIs array: ${Array.isArray(response)}\nHas success: ${!!response?.success}\nHas data: ${!!response?.data}\n\nFull response logged to console.`);
      }
    } catch (error) {
      console.error('🔍 [TagInput] Step ERROR:', error);
      console.error('🔍 [TagInput] Error details:', {
        message: error?.message,
        response: error?.response,
        data: error?.response?.data,
      });
      alert(`❌ [TagInput] ERROR fetching tags:\n\n${error?.message || 'Unknown error'}\n\nCheck console for details.`);
    } finally {
      setLoading(false);
      console.log('🔍 [TagInput] Step 5: Loading complete');
    }
  };

  // Get selected tag objects from IDs
  const selectedTags = tags.filter(tag => value.includes(tag.id));

  // Handle tag selection change
  const handleChange = (_event: any, newValue: Tag[]) => {
    const tagIds = newValue.map(tag => tag.id);
    onChange(tagIds);
  };

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
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          error={!!error}
          helperText={error || helperText}
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
          <p className="text-sm text-gray-600">No tags available</p>
          <p className="text-xs text-gray-500 mt-1">Create tags in Tag Management</p>
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

