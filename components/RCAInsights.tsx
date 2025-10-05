
import React, { useState, useCallback } from 'react';
import { RCAInsight } from '../types';
import { generateInsightsSummary } from '../services/geminiService';

interface RCAInsightsProps {
  insights: RCAInsight[];
}

const severityColorMap: Record<RCAInsight['severity'], string> = {
  High: 'bg-red-500/20 text-red-300 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Low: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

const RCAInsights: React.FC<RCAInsightsProps> = ({ insights }) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSummary('');
    try {
      const generatedSummary = await generateInsightsSummary(insights);
      setSummary(generatedSummary);
    } catch (e) {
      setError('Failed to generate summary.');
      console.error(e);
    }
    setIsLoading(false);
  }, [insights]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">RCA & Quality Insights</h2>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="px-3 py-1 text-sm font-medium bg-gray-700 text-cyan-300 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Generate executive summary with Gemini"
        >
          {isLoading ? 'Generating...' : 'Generate Executive Summary'}
        </button>
      </div>

      {summary && (
        <div className="mb-4 bg-gray-900/50 p-4 rounded-md border border-gray-700">
            <h3 className="font-semibold text-cyan-400 mb-2">Executive Summary</h3>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{summary}</p>
        </div>
      )}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className={`p-4 rounded-md border ${severityColorMap[insight.severity]}`}>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-100 mb-1">{insight.title}</h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${severityColorMap[insight.severity]}`}>
                  {insight.severity}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{insight.finding}</p>
            <p className="text-sm text-gray-300">
              <span className="font-semibold">Recommendation: </span>
              {insight.recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RCAInsights;
