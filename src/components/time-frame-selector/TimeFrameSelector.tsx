import { TIME_FRAMES } from '@/helpers/parseDataForHistogram';
import { useContext } from 'react';
import { I18nContext } from '../page';

type TimeFrameSelectorProps = {
  timeFrame: number;
  setTimeFrame: (timeFrame: number) => void;
};

export function TimeFrameSelector({
  timeFrame,
  setTimeFrame,
}: TimeFrameSelectorProps) {
  const { t } = useContext(I18nContext);

  return (
    <div>
      {Object.keys(TIME_FRAMES).map((key) => {
        const selectedClass =
          timeFrame === TIME_FRAMES[key as keyof typeof TIME_FRAMES]
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700';
        return (
          <button
            key={key}
            onClick={() =>
              setTimeFrame(TIME_FRAMES[key as keyof typeof TIME_FRAMES])
            }
            className={`m-2 p-1 capitalize ${selectedClass}`}
          >
            <span>{t(key.toLowerCase())}</span>
          </button>
        );
      })}
    </div>
  );
}
