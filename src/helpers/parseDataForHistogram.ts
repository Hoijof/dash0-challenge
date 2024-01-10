import { HistogramData } from '@/components/histogram';
import {
  IExportLogsServiceRequest,
  IResourceLogs,
  ILogRecord,
  IResource,
  Fixed64,
  IScopeLogs,
} from '@opentelemetry/otlp-transformer';

export const TIME_FRAMES = {
  MINUTE: 6e10,
  HOUR: 3.6e12,
  DAY: 8.64e13,
  WEEK: 6.048e14,
};

export function parseDataForHistogram(
  data: IExportLogsServiceRequest,
  bucketSize: number
): HistogramData[] {
  const logRecords: { [key: number]: number } = {};

  data.resourceLogs?.forEach((resourceLog: IResourceLogs) => {
    resourceLog.scopeLogs.forEach((scopeLog: IScopeLogs) => {
      const scopeLogs: ILogRecord[] = scopeLog.logRecords || [];

      scopeLogs.forEach((log: ILogRecord) => {
        addOrCreateHistogramData(log, logRecords, bucketSize);
      });
    });
  });

  const mappedData = Object.keys(logRecords).map((key) => {
    const timestamp = parseInt(key);

    return {
      timestamp: timestamp.toString(),
      logs: logRecords[timestamp],
    };
  });

  return mappedData.sort(
    (a, b) => parseInt(a.timestamp) - parseInt(b.timestamp)
  );
}

// This function will add a new histogram data point to the logRecords array if it doesn't exist, or increment the count of an existing data point.
// the bucketSize is the size of the time bucket in nanoseconds.
function addOrCreateHistogramData(
  { timeUnixNano }: ILogRecord,
  logRecords: { [key: number]: number },
  bucketSize: number
): void {
  const timeBucket =
    Math.floor(parseInt(timeUnixNano as any) / bucketSize) * bucketSize;
  const existingData = logRecords[timeBucket];

  if (isNaN(timeBucket)) {
    console.warn('Invalid time bucket: ', timeBucket);
    return;
  }

  if (existingData) {
    logRecords[timeBucket]++;
  } else {
    logRecords[timeBucket] = 1;
  }
}

export function humanizeTimestamps(data: HistogramData[]): HistogramData[] {
  return data.map((item) => {
    const timestamp = parseInt(item.timestamp);
    const date = new Date(timestamp / 1000000);

    return {
      ...item,
      timestamp: date.toLocaleString(),
    };
  });
}
