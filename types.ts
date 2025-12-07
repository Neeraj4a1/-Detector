export enum VerdictType {
  REAL = 'REAL',
  FAKE = 'FAKE',
  MISLEADING = 'MISLEADING',
  SATIRE = 'SATIRE',
  UNVERIFIED = 'UNVERIFIED',
  UNKNOWN = 'UNKNOWN'
}

export interface Source {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  verdict: VerdictType;
  confidenceScore: number; // 0 to 100
  explanation: string;
  sources: Source[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}