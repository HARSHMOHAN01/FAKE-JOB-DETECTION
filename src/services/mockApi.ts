interface PredictionData {
  isFake: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  redFlags: string[];
}

const suspiciousKeywords = [
  'easy money',
  'work from home',
  'no experience',
  'guaranteed income',
  'pay upfront',
  'wire transfer',
  'send money',
  'processing fee',
  'training fee',
  'pay us',
  'western union',
  'gift card',
  'bitcoin',
  'cryptocurrency',
  'urgent',
  'act now',
  'limited time',
  'too good to be true',
];

const vagueTerms = [
  'various tasks',
  'general duties',
  'miscellaneous',
  'flexible',
  'diverse responsibilities',
];

export function analyzeFakeJob(jobDescription: string): PredictionData {
  const lowerDesc = jobDescription.toLowerCase();
  const redFlags: string[] = [];
  let suspicionScore = 0;

  suspiciousKeywords.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) {
      suspicionScore += 15;
      redFlags.push(`Contains suspicious phrase: "${keyword}"`);
    }
  });

  vagueTerms.forEach((term) => {
    if (lowerDesc.includes(term)) {
      suspicionScore += 8;
      redFlags.push(`Vague job description: "${term}"`);
    }
  });

  if (!lowerDesc.match(/\b(salary|compensation|pay|wage)\b/)) {
    suspicionScore += 10;
    redFlags.push('No salary information provided');
  }

  if (!lowerDesc.match(/\b(experience|years|background|qualification)\b/)) {
    suspicionScore += 12;
    redFlags.push('Missing experience requirements');
  }

  if (!lowerDesc.match(/\b(responsibilities|duties|role|tasks)\b/)) {
    suspicionScore += 15;
    redFlags.push('Unclear job responsibilities');
  }

  if (lowerDesc.includes('$') && lowerDesc.match(/\$\d{1,3},?\d{3,}/)) {
    const salaries = lowerDesc.match(/\$(\d{1,3}),?(\d{3,})/g);
    if (salaries) {
      salaries.forEach((salary) => {
        const amount = parseInt(salary.replace(/\$|,/g, ''));
        if (amount > 500000) {
          suspicionScore += 20;
          redFlags.push('Unrealistically high salary offered');
        }
      });
    }
  }

  if (jobDescription.length < 100) {
    suspicionScore += 15;
    redFlags.push('Job description is unusually short');
  }

  if (!lowerDesc.match(/\b(company|organization|firm|corporation)\b/)) {
    suspicionScore += 10;
    redFlags.push('No company information provided');
  }

  const allCaps = jobDescription.match(/[A-Z]{10,}/g);
  if (allCaps && allCaps.length > 2) {
    suspicionScore += 10;
    redFlags.push('Excessive use of capital letters');
  }

  const exclamations = (jobDescription.match(/!/g) || []).length;
  if (exclamations > 5) {
    suspicionScore += 8;
    redFlags.push('Excessive punctuation usage');
  }

  suspicionScore = Math.min(suspicionScore, 100);
  const confidence = Math.round(suspicionScore * 0.85 + Math.random() * 10);
  const isFake = confidence > 50;

  let riskLevel: 'low' | 'medium' | 'high';
  if (confidence < 40) {
    riskLevel = 'low';
  } else if (confidence < 70) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }

  return {
    isFake,
    confidence: Math.min(confidence, 99),
    riskLevel,
    redFlags: redFlags.slice(0, 5),
  };
}
