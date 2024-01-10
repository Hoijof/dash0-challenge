import {
  IExportLogsServiceRequest,
  IResourceLogs,
  ILogRecord,
  IResource,
  Fixed64,
  IScopeLogs,
} from '@opentelemetry/otlp-transformer';

export type ResourceAttributes = {
  [key: string]: string;
};

export type ScopeAttributes = {
  [key: string]: string;
};

export interface LogRecord {
  severity: string;
  time: Fixed64;
  body: string | number | boolean | undefined;
  extraInfo: ResourceAttributes & ScopeAttributes;
}

export function normalizeData(data: IExportLogsServiceRequest): LogRecord[] {
  const logRecords: LogRecord[] = [];

  data.resourceLogs?.forEach((resourceLog: IResourceLogs) => {
    const resourceAttributes: ResourceAttributes = getAttributes(
      resourceLog.resource?.attributes
    );

    resourceLog.scopeLogs.forEach((scopeLog: IScopeLogs) => {
      const scopeAttributes: ScopeAttributes = getAttributes(
        scopeLog?.scope?.attributes
      );

      const scopeLogs: ILogRecord[] = scopeLog.logRecords || [];

      scopeLogs.forEach((log: ILogRecord) => {
        const logRecord: LogRecord = {
          severity: log.severityText || '',
          time: log.timeUnixNano || 0,
          body: log.body?.stringValue || '',
          extraInfo: {
            ...resourceAttributes,
            ...scopeAttributes,
          },
        };

        logRecords.push(logRecord);
      });
    });
  });

  return logRecords;
}

function getAttributes(
  attributes?: IResource['attributes']
): ResourceAttributes {
  const resourceAttributes: ResourceAttributes = {};

  attributes?.forEach((attribute) => {
    resourceAttributes[attribute.key] = attribute.value.stringValue || '';
  });

  return resourceAttributes;
}
