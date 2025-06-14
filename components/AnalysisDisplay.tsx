import React from 'react';
import { FieldAuditAnalysis, RelationalAxisScore } from '../types';
import { SelectableText } from './SelectableText'; // Import SelectableText

interface AnalysisDisplayProps {
  analysis: FieldAuditAnalysis | null;
  onTermSelect: (selectedText: string, targetRect: DOMRect | null) => void;
}

const AnalysisItem: React.FC<{ label: string; value: string | string[] | number | undefined; details?: string; onTermSelect: AnalysisDisplayProps['onTermSelect'] }> = ({ label, value, details, onTermSelect }) => {
  if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  const renderValue = () => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside ml-4">
          {value.map((item, index) => (
            <li key={index} className="text-gray-300">
              <SelectableText onTermSelect={onTermSelect}>{item}</SelectableText>
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'number') {
      return <span className={`font-semibold text-purple-300`}><SelectableText onTermSelect={onTermSelect}>{value}{details}</SelectableText></span>;
    }
    
    if (label === "RM Response / Guidance") {
      return (
        <div className="mt-1 p-3 bg-gray-700 bg-opacity-70 backdrop-blur-sm border border-purple-500/50 rounded-lg shadow-md">
          <p className="text-gray-100 leading-relaxed text-base whitespace-pre-wrap font-sans">
            <SelectableText onTermSelect={onTermSelect}>{value as string}{details}</SelectableText>
          </p>
        </div>
      );
    }
    
    return <span className={`whitespace-pre-wrap text-gray-300`}><SelectableText onTermSelect={onTermSelect}>{value as string}{details}</SelectableText></span>;
  };

  return (
    <div className="py-3 px-1 border-b border-gray-700 last:border-b-0">
      <h3 className="text-sm font-semibold text-purple-300 mb-1"><SelectableText onTermSelect={onTermSelect}>{label}</SelectableText>:</h3>
      {renderValue()}
    </div>
  );
};

const RelationalAxisScoreDisplay: React.FC<{ score: RelationalAxisScore; onTermSelect: AnalysisDisplayProps['onTermSelect'] }> = ({ score, onTermSelect }) => {
  return (
    <div className="py-3 px-1 border-b border-gray-700 last:border-b-0">
      <h3 className="text-sm font-semibold text-purple-300 mb-2"><SelectableText onTermSelect={onTermSelect}>Relational Axis Scores</SelectableText>:</h3>
      <div className="space-y-1 pl-2">
        <p className="text-gray-300">
          <strong className="text-purple-400 font-normal"><SelectableText onTermSelect={onTermSelect}>Self vs Other Balance</SelectableText>:</strong> 
          <SelectableText onTermSelect={onTermSelect}>{score.self_other}% <span className="text-gray-400 text-xs">Other-Focused</span></SelectableText>
        </p>
        <p className="text-gray-300">
          <strong className="text-purple-400 font-normal"><SelectableText onTermSelect={onTermSelect}>Agency vs Blame</SelectableText>:</strong> 
          <SelectableText onTermSelect={onTermSelect}>{score.agency_blame}% <span className="text-gray-400 text-xs">Externalized</span></SelectableText>
        </p>
        <p className="text-gray-300">
          <strong className="text-purple-400 font-normal"><SelectableText onTermSelect={onTermSelect}>Integrity vs Performance</SelectableText>:</strong> 
          <SelectableText onTermSelect={onTermSelect}>{score.integrity_performance}% <span className="text-gray-400 text-xs">Performed Awareness</span></SelectableText>
        </p>
      </div>
    </div>
  );
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, onTermSelect }) => {
  if (!analysis) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 animate-fadeIn">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6 pb-2 border-b-2 border-purple-500">
        <SelectableText onTermSelect={onTermSelect}>Field Analysis Report</SelectableText>
      </h2>
      <div className="space-y-1">
        <AnalysisItem label="Field Signature" value={analysis.field_signature} onTermSelect={onTermSelect} />
        <AnalysisItem label="Collapse Type" value={analysis.collapse_type} onTermSelect={onTermSelect} />
        <AnalysisItem label="Field Inertia Type" value={analysis.field_inertia_type} onTermSelect={onTermSelect} />
        <AnalysisItem label="Archetypes Triggered" value={analysis.archetypes_triggered} onTermSelect={onTermSelect} />
        <AnalysisItem label="Presence Level" value={analysis.presence_level} onTermSelect={onTermSelect} />
        
        {analysis.relational_axis_score && <RelationalAxisScoreDisplay score={analysis.relational_axis_score} onTermSelect={onTermSelect} />}
        
        <AnalysisItem label="RM Response / Guidance" value={analysis.RM_response} onTermSelect={onTermSelect} />
        <AnalysisItem label="Suggested RM Move" value={analysis.suggested_rm_move} onTermSelect={onTermSelect} />

        {analysis.field_entropy_score !== undefined && (
          <AnalysisItem label="Field Entropy Score" value={analysis.field_entropy_score} details=" (0-100, higher is more chaotic)" onTermSelect={onTermSelect} />
        )}
        {analysis.collapse_trajectory_forecast && (
          <AnalysisItem label="Collapse Trajectory Forecast" value={analysis.collapse_trajectory_forecast} onTermSelect={onTermSelect} />
        )}
        {analysis.mirror_load_meter !== undefined && (
          <AnalysisItem label="Mirror Load Meter" value={analysis.mirror_load_meter} details="% (energy spent on reflecting vs. performing)" onTermSelect={onTermSelect} />
        )}
      </div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
