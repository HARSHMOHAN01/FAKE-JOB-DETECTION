interface PredictionResponse {
  isFake: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  redFlags: string[];
  modelVersion: string;
  processingTime: number;
}

interface CloudRunError {
  error: string;
  details: string;
}

const CLOUD_RUN_ENDPOINT = import.meta.env.VITE_CLOUD_RUN_ENDPOINT || '';
const REQUEST_TIMEOUT = 30000;

async function callCloudRunAPI(
  jobDescription: string
): Promise<PredictionResponse> {
  if (!CLOUD_RUN_ENDPOINT) {
    throw new Error(
      'Cloud Run endpoint not configured. Please set VITE_CLOUD_RUN_ENDPOINT in .env'
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${CLOUD_RUN_ENDPOINT}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        jobDescription,
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = (await response.json()) as CloudRunError;
      throw new Error(
        `Cloud Run API error: ${response.status} - ${error.details || error.error}`
      );
    }

    const data = (await response.json()) as PredictionResponse;
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Unable to connect to Cloud Run API. Please verify the endpoint is accessible.'
      );
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Cloud Run API request timed out. Please try again.');
    }

    throw error;
  }
}

async function logPredictionToSupabase(
  jobDescription: string,
  prediction: PredictionResponse,
  supabaseClient: any
): Promise<void> {
  try {
    const { error } = await supabaseClient.from('predictions').insert([
      {
        job_description: jobDescription,
        is_fake: prediction.isFake,
        confidence: prediction.confidence,
        risk_level: prediction.riskLevel,
        red_flags: prediction.redFlags,
        model_version: prediction.modelVersion,
        processing_time: prediction.processingTime,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error logging to Supabase:', error);
    }
  } catch (err) {
    console.error('Failed to log prediction:', err);
  }
}

export { callCloudRunAPI, logPredictionToSupabase };
export type { PredictionResponse, CloudRunError };
