'use client';

import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { Histogram, HistogramData } from '@/components/histogram';
import {
  humanizeTimestamps,
  parseDataForHistogram,
  TIME_FRAMES,
} from '@/helpers/parseDataForHistogram';
import { fetcher } from '@/helpers/fetcher';
import { TimeFrameSelector } from '@components/time-frame-selector/TimeFrameSelector';
import {
  DateRange,
  DateRangeSelector,
} from '@components/date-range-selector/DateRangeSelector';
import { I18nContext } from '@/components/page';

const DATA_URL =
  'https://take-home-assignment-otlp-logs-api.vercel.app/api/logs';

export default function HistogramPage() {
  const { data: apiData, isLoading } = useSWR(DATA_URL, fetcher);
  const { t } = useContext(I18nContext);

  const [histogramData, setHistogramData] = useState<HistogramData[]>([]);
  const [bucketSize, setBucketSize] = useState(TIME_FRAMES.WEEK);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  useEffect(() => {
    if (apiData) {
      const formattedData = parseDataForHistogram(apiData, bucketSize);
      const filteredData = dateRange
        ? formattedData.filter(
            (data) =>
              data.timestamp >= dateRange.startDate.toString() &&
              data.timestamp <= dateRange.endDate.toString()
          )
        : formattedData;

      setHistogramData(humanizeTimestamps(filteredData));
    }
  }, [apiData, bucketSize, dateRange]);

  if (isLoading) {
    return <div>{t('loading')}...</div>;
  }

  return (
    <section className='flex h-full w-full flex-col'>
      <div className='flex justify-center p-4'>
        <TimeFrameSelector
          timeFrame={bucketSize}
          setTimeFrame={setBucketSize}
        />
      </div>
      <div className='flex justify-center p-4'>
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      <div className='flex-grow'>
        <Histogram
          data={histogramData}
          timeFrame={t(getBucketSizeLabel(bucketSize))}
        />
      </div>
    </section>
  );
}

function getBucketSizeLabel(bucketSize: number) {
  switch (bucketSize) {
    case TIME_FRAMES.MINUTE:
      return 'minute';
    case TIME_FRAMES.HOUR:
      return 'hour';
    case TIME_FRAMES.DAY:
      return 'day';
    case TIME_FRAMES.WEEK:
      return 'week';
    default:
      return 'timeframe';
  }
}
