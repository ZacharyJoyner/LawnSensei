import React, { createContext, useReducer, useContext } from 'react';

// Create Context
const MapContext = createContext();

// Initial State
const initialState = {
  sections: [],
  userPreferences: {},
  // Add other global states as needed
};

// Action Types
const ACTIONS = {
  ADD_SECTION: 'ADD_SECTION',
  UPDATE_SECTION: 'UPDATE_SECTION',
  DELETE_SECTION: 'DELETE_SECTION',
  // Add other actions as needed
};

// Reducer Function
const mapReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_SECTION:
      return { ...state, sections: [...state.sections, action.payload] };
    case ACTIONS.UPDATE_SECTION:
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.id ? { ...section, ...action.payload.updates } : section
        ),
      };
    case ACTIONS.DELETE_SECTION:
      return {
        ...state,
        sections: state.sections.filter((section) => section.id !== action.payload.id),
      };
    default:
      return state;
  }
};

// Provider Component
export const MapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  // Action Creators
  const addSection = (section) => {
    dispatch({ type: ACTIONS.ADD_SECTION, payload: section });
  };

  const updateSection = (id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_SECTION, payload: { id, updates } });
  };

  const deleteSection = (id) => {
    dispatch({ type: ACTIONS.DELETE_SECTION, payload: { id } });
  };

  return (
    <MapContext.Provider
      value={{
        sections: state.sections,
        userPreferences: state.userPreferences,
        addSection,
        updateSection,
        deleteSection,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

// Custom Hook for Using Context
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}; 