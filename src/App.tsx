import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Loader2, Briefcase } from 'lucide-react';
import JobInputForm from './components/JobInputForm';
import PredictionResult from './components/PredictionResult';
import { analyzeFakeJob } from './services/mockApi';

interface PredictionData {
  isFake: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  redFlags: string[];
}

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (jobDescription: string) => {
    setIsAnalyzing(true);
    setError(null);
    setPrediction(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = analyzeFakeJob(jobDescription);
      setPrediction(result);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800">
              Fake Job Detector
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            AI-powered analysis to protect job seekers from fraudulent postings.
            Using advanced NLP and machine learning to identify suspicious patterns.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Powered by Vertex AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Cloud Run API</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>BigQuery Analytics</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <JobInputForm
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              onReset={handleReset}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Analysis Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-8">
            {isAnalyzing ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Analyzing Job Posting
                </h3>
                <p className="text-slate-600">
                  Our AI is examining patterns, language, and suspicious indicators...
                </p>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Processing text</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Running ML model</span>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Calculating confidence</span>
                    <div className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ) : prediction ? (
              <PredictionResult prediction={prediction} />
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
                <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-slate-600">
                  Paste a job description and click "Analyze Job Posting" to detect potential fraud.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>
            Made With Love in India
          </p>
          <p className="mt-2">
            Team: Byte Brigadier | HackSprint 2024
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
