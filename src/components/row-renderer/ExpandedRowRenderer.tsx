import * as React from 'react';
import { defaultTableRowRenderer as DefaultRowRenderer } from 'react-virtualized';

export type RowRendererParams = {
  [key: string]: any;
};

export type A11yProps = {
  [key: string]: any;
};

/**
 * Default row renderer for Table.
 */
export default function ExpandedRowRenderer({
  onRowClick,
  key,
  ...props
}: RowRendererParams) {
  const { rowData, index, style, className } = props;

  if (!rowData.isSelected) {
    return (
      <DefaultRowRenderer
        key={index}
        onRowClick={onRowClick}
        {...(props as any)}
      />
    );
  }

  return (
    <div
      style={{ ...style, display: 'flex', flexDirection: 'column' }}
      className={className}
      key={key}
    >
      {DefaultRowRenderer({
        ...(props as any),
        key: { index },
        style: { width: style.width, height: 48 },
        onRowClick,
      })}
      <div
        style={{
          marginRight: 'auto',
          marginLeft: 80,
          height: 48,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {JSON.stringify(rowData.extraInfo)}
      </div>
    </div>
  );
}
