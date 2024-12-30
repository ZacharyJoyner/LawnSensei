import { useState, useCallback } from 'react';
import { useMapContext } from '../components/onboarding/context/MapContext';

export const useSectionManager = () => {
  const { addSection, updateSection, deleteSection } = useMapContext();
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handlePolygonComplete = useCallback(
    (newSection) => {
      try {
        addSection(newSection);
        console.log('New Section Added:', newSection);
      } catch (err) {
        setError('Failed to add section');
        console.error('Error adding section:', err);
      }
    },
    [addSection]
  );

  const handleEditLabel = (sectionId) => {
    setSelectedSection({ id: sectionId });
    setEditLabel('');
    setIsEditing(true);
  };

  const handleSaveLabel = () => {
    if (selectedSection && editLabel.trim()) {
      updateSection(selectedSection.id, { label: editLabel.trim() });
      setIsEditing(false);
      setSelectedSection(null);
      setEditLabel('');
    }
  };

  const handleDeleteSection = (sectionId) => {
    try {
      deleteSection(sectionId);
    } catch (err) {
      setError('Failed to delete section');
      console.error('Error deleting section:', err);
    }
  };

  return {
    error,
    setError,
    selectedSection,
    editLabel,
    setEditLabel,
    isEditing,
    handlePolygonComplete,
    handleEditLabel,
    handleSaveLabel,
    handleDeleteSection,
  };
}; 