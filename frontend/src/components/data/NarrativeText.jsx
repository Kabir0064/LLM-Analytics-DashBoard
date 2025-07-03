function NarrativeText({ text }) {
  if (!text) {
    return null;
  }

  // Split text by newlines to handle paragraphs
  const paragraphs = text.split('\n').filter(p => p.trim());

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Analysis Interpretation
          </h3>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm text-blue-700 mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NarrativeText;