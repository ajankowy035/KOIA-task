interface KnownResponse {
  class: string;
  value: number[];
  label: string;
  source: string;
  size: number[];
  dimension: { Tid: { category: { index: Record<string, number> } } };
}

interface UnknownResponse {
  [key: string]: unknown;
}

export type ApiChartResponse = KnownResponse & UnknownResponse;
