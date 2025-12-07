import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult, VerdictType } from '../types';
import ConfidenceChart from './ConfidenceChart';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertTriangleIcon, 
  ExternalLinkIcon 
} from './Icons';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getVerdictStyles = (verdict: VerdictType) => {
    switch (verdict) {
      case VerdictType.REAL:
        return {
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-400/10',
          borderColor: 'border-emerald-500/50',
          icon: <CheckCircleIcon className="w-12 h-12 text-emerald-400" />,
          chartColor: '#34d399'
        };
      case VerdictType.FAKE:
        return {
          color: 'text-rose-500',
          bgColor: 'bg-rose-500/10',
          borderColor: 'border-rose-500/50',
          icon: <XCircleIcon className="w-12 h-12 text-rose-500" />,
          chartColor: '#f43f5e'
        };
      case VerdictType.MISLEADING:
      case VerdictType.SATIRE:
        return {
          color: 'text-amber-400',
          bgColor: 'bg-amber-400/10',
          borderColor: 'border-amber-500/50',
          icon: <AlertTriangleIcon className="w-12 h-12 text-amber-400" />,
          chartColor: '#fbbf24'
        };
      default:
        return {
          color: 'text-slate-400',
          bgColor: 'bg-slate-700/30',
          borderColor: 'border-slate-500/30',
          icon: <AlertTriangleIcon className="w-12 h-12 text-slate-400" />,
          chartColor: '#94a3b8'
        };
    }
  };

  const styles = getVerdictStyles(result.verdict);

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <div className={`rounded-2xl border ${styles.borderColor} ${styles.bgColor} overflow-hidden shadow-xl backdrop-blur-sm`}>
        {/* Header Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-white/5 backdrop-blur-md shadow-inner">
              {styles.icon}
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Verdict</h2>
              <h1 className={`text-4xl md:text-5xl font-black ${styles.color} tracking-tight`}>
                {result.verdict}
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <ConfidenceChart score={result.confidenceScore} color={styles.chartColor} />
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          
          {/* Explanation */}
          <div className="col-span-2 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              Analysis & Reasoning
            </h3>
            <div className="prose prose-invert prose-sm md:prose-base max-w-none text-slate-300 leading-relaxed">
              <ReactMarkdown>{result.explanation}</ReactMarkdown>
            </div>
          </div>

          {/* Sources */}
          <div className="col-span-1 p-6 md:p-8 bg-black/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              Verified Sources
            </h3>
            {result.sources.length > 0 ? (
              <ul className="space-y-3">
                {result.sources.map((source, index) => (
                  <li key={index}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
                    >
                      <ExternalLinkIcon className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0 group-hover:text-blue-300" />
                      <div>
                        <p className="text-sm text-blue-100 font-medium line-clamp-2 group-hover:text-blue-300 transition-colors">
                          {source.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 truncate max-w-[180px]">
                          {new URL(source.uri).hostname}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic">
                No direct web sources were cited by the analysis engine, but internal knowledge was applied.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;