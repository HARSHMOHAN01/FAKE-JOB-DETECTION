import { useState } from 'react';
import { Send, RotateCcw, FileText } from 'lucide-react';

interface JobInputFormProps {
  onAnalyze: (jobDescription: string) => void;
  isAnalyzing: boolean;
  onReset: () => void;
}

const SAMPLE_JOB = `Senior Software Engineer - Remote
Salary: $150,000 - $200,000

We are seeking an experienced Senior Software Engineer to join our team.

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Mentor junior developers
- Participate in code reviews

Requirements:
- 5+ years of software development experience
- Strong knowledge of React, Node.js, and TypeScript
- Experience with cloud platforms (AWS, GCP, or Azure)
- Excellent problem-solving skills

Benefits:
- Competitive salary and equity
- Health, dental, and vision insurance
- 401k matching
- Flexible work schedule`;

function JobInputForm({ onAnalyze, isAnalyzing, onReset }: JobInputFormProps) {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobDescription.trim()) {
      onAnalyze(jobDescription);
    }
  };

  const handleLoadSample = () => {
    setJobDescription(SAMPLE_JOB);
  };

  const handleClear = () => {
    setJobDescription('');
    onReset();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Job Description
        </h2>
        <button
          type="button"
          onClick={handleLoadSample}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Load Sample
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here... Include details like job title, salary, responsibilities, requirements, and company information."
            className="w-full h-80 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-slate-700 placeholder:text-slate-400"
            disabled={isAnalyzing}
          />
          <div className="flex items-center justify-between mt-2 text-sm text-slate-500">
            <span>{jobDescription.length} characters</span>
            {jobDescription.length < 50 && jobDescription.length > 0 && (
              <span className="text-amber-600">Minimum 50 characters recommended</span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isAnalyzing || jobDescription.trim().length < 10}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze Job Posting
              </>
            )}
          </button>

          {jobDescription && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isAnalyzing}
              className="bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-600 mb-3 font-medium">
          What we analyze:
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            Unrealistic promises
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            Vague requirements
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            Suspicious language
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            Contact anomalies
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobInputForm;
