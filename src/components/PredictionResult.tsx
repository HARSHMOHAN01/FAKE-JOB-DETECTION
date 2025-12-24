import { Shield, AlertTriangle, TrendingUp, Info } from 'lucide-react';

interface PredictionData {
  isFake: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  redFlags: string[];
}

interface PredictionResultProps {
  prediction: PredictionData;
}

function PredictionResult({ prediction }: PredictionResultProps) {
  const { isFake, confidence, riskLevel, redFlags } = prediction;

  const getRiskColor = () => {
    if (riskLevel === 'low') return 'text-green-600';
    if (riskLevel === 'medium') return 'text-amber-600';
    return 'text-red-600';
  };

  const getRiskBgColor = () => {
    if (riskLevel === 'low') return 'bg-green-50 border-green-200';
    if (riskLevel === 'medium') return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const getRiskBadgeColor = () => {
    if (riskLevel === 'low') return 'bg-green-100 text-green-700';
    if (riskLevel === 'medium') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className={`rounded-2xl shadow-xl p-8 border-2 transition-all ${getRiskBgColor()}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {isFake ? (
            <div className="bg-red-600 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          ) : (
            <div className="bg-green-600 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {isFake ? 'Potential Fake Job' : 'Legitimate Job'}
            </h3>
            <p className={`text-sm font-medium mt-1 ${getRiskColor()}`}>
              {riskLevel.toUpperCase()} RISK
            </p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-lg text-sm font-bold ${getRiskBadgeColor()}`}>
          {confidence}% Confidence
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Confidence Score</span>
            <span className="text-sm font-bold text-slate-800">{confidence}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out ${
                isFake ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {isFake && redFlags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-slate-800">Detected Red Flags</h4>
            </div>
            <ul className="space-y-2">
              {redFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isFake && (
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800 mb-1">Job appears legitimate</p>
                <p className="text-sm text-slate-600">
                  This posting shows standard professional patterns and no significant red flags were detected.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-800 mb-1">Recommendation</p>
              <p className="text-sm text-slate-700">
                {isFake
                  ? 'Exercise caution. Verify company details independently and avoid sharing personal information until legitimacy is confirmed.'
                  : 'While this job appears legitimate, always research the company and verify details before sharing sensitive information.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-300">
        <p className="text-xs text-slate-600 text-center">
          Analysis powered by ML models trained on thousands of job postings
        </p>
      </div>
    </div>
  );
}

export default PredictionResult;
