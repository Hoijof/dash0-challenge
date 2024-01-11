import React, { Dispatch, SetStateAction, useContext } from 'react';
import { I18nContext } from '../page';

export type DateRange = {
  startDate: number;
  endDate: number;
};

type DateRangeSelectorProps = {
  dateRange: DateRange | null;
  setDateRange: Dispatch<SetStateAction<DateRange | null>>;
};

const ONE_DAY_IN_MILLISECONDS = 86400000;

export function DateRangeSelector({
  dateRange,
  setDateRange,
}: DateRangeSelectorProps) {
  const { t } = useContext(I18nContext);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const startDate: number = event.target.valueAsNumber;
    setDateRange((prevDateRange: DateRange | null) => ({
      startDate,
      endDate: prevDateRange?.endDate || startDate + ONE_DAY_IN_MILLISECONDS,
    }));
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = event.target.valueAsNumber;
    setDateRange((prevDateRange: DateRange | null) => ({
      startDate: prevDateRange?.startDate || endDate - ONE_DAY_IN_MILLISECONDS,
      endDate,
    }));
  };

  const handleClear = () => {
    setDateRange(null);
  };

  return (
    <div className='flex items-center'>
      <label htmlFor='startDate'>{t('startDate')}:</label>
      <input
        type='date'
        id='startDate'
        value={
          dateRange?.startDate
            ? new Date(dateRange.startDate).toISOString().split('T')[0]
            : ''
        }
        onChange={handleStartDateChange}
      />

      <label htmlFor='endDate'>{t('endDate')}:</label>
      <input
        type='date'
        id='endDate'
        value={
          dateRange?.endDate
            ? new Date(dateRange.endDate).toISOString().split('T')[0]
            : ''
        }
        onChange={handleEndDateChange}
      />

      <button
        className='m-1 rounded-sm bg-gray-200 p-1 capitalize text-gray-700 hover:ring-1'
        onClick={handleClear}
      >
        {' '}
        {t('clear')}
      </button>
    </div>
  );
}

export default DateRangeSelector;
