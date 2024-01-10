'use client';

import {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Table,
  Column,
  TableRowRenderer,
  AutoSizer,
  Index,
  SortDirection,
  SortDirectionType,
} from 'react-virtualized';

import useSWR from 'swr';
import { normalizeData } from '@helpers/parseDataForRendering';

import 'react-virtualized/styles.css';
import ExpandedRowRenderer from '@/components/row-renderer/ExpandedRowRenderer';
import { fetcher } from '@/helpers/fetcher';
import { I18nContext } from '@/components/page';

const TABLE_ROW_HEIGHT = 30;
const EXPANDED_TABLE_ROW_HEIGHT = 96;
const TABLE_HEADER_HEIGHT = 30;

const Page = () => {
  const {
    data: apiData,
    error,
    isLoading,
  } = useSWR(
    'https://take-home-assignment-otlp-logs-api.vercel.app/api/logs',
    fetcher
  );

  const tableRef = useRef<Table>();
  const [sortBy, setSortBy] = useState('time');
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(
    SortDirection.ASC
  );
  const [sortedData, setSortedData] = useState(apiData);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (apiData) {
      setSortedData(normalizeData(apiData));
    }
  }, [apiData]);

  const getRowHeight = ({ index }: { index: number }) =>
    expandedRows.has(index) ? EXPANDED_TABLE_ROW_HEIGHT : TABLE_ROW_HEIGHT;

  const sort = useCallback(
    ({
      sortBy,
      sortDirection,
    }: {
      sortBy: string;
      sortDirection: SortDirectionType;
    }) => {
      setSortBy(sortBy);
      setSortDirection(sortDirection);

      const newSortedData = sortedData.sort((a: any, b: any) => {
        if (sortDirection === 'ASC') {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });

      setExpandedRows(new Set());
      setSortedData([...newSortedData]);
    },
    [sortedData, setSortedData, setSortBy, setSortDirection]
  );

  const parsedData = useMemo(
    () =>
      Array.isArray(sortedData) &&
      sortedData.map((row: any, index: number) => {
        if (expandedRows.has(index)) {
          return { ...row, isSelected: true };
        } else {
          return row;
        }
      }),
    [expandedRows, sortedData]
  );

  useEffect(() => {
    tableRef.current?.recomputeRowHeights();
  }, [expandedRows]);

  const onRowClick = useCallback(
    ({
      event,
      index,
      rowData,
    }: {
      event: any;
      index: number;
      rowData: any;
    }) => {
      const newSet = new Set(expandedRows);

      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }

      setExpandedRows(newSet);
    },
    [expandedRows]
  );

  const { t } = useContext(I18nContext);

  if (error) {
    return <div>Error loading data</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          ref={tableRef as LegacyRef<Table>}
          headerHeight={TABLE_HEADER_HEIGHT}
          height={height}
          rowHeight={getRowHeight}
          rowGetter={({ index }: Index) => parsedData && parsedData[index]}
          rowCount={parsedData ? parsedData.length : 0}
          sort={sort}
          sortBy={sortBy}
          sortDirection={sortDirection}
          width={width}
          onRowClick={onRowClick}
          rowRenderer={ExpandedRowRenderer}
        >
          <Column dataKey='time' label={t('time')} width={200} />
          <Column dataKey='severity' label={t('severity')} width={120} />
          <Column dataKey='body' label={t('body')} width={180} flexGrow={1} />
        </Table>
      )}
    </AutoSizer>
  );
};

export default Page;
