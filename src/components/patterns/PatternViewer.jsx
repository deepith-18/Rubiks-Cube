import React from 'react';
// This component might be used if you click a pattern and want a larger view
// before applying it, or more details. For now, PatternGallery directly applies.
// You could activate this via a Modal or separate route if needed.

function PatternViewer({ pattern }) {
  if (!pattern) return null;

  return (
    <div className="p-4 border rounded">
       <h2>{pattern.name}</h2>
      {/* Maybe show a larger preview or description */}
      <img
        src={require(`../../assets/images/${pattern.previewImage}`)}
        alt={pattern.name}
        className="w-full h-48 object-contain mb-2 border"
       />
       <p>Description or details about the pattern...</p>
       {/* Add Apply/Solve buttons specific to this view if needed */}
    </div>
  );
}

export default PatternViewer;