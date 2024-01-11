import * as React from 'react';
import { defaultTableRowRenderer as DefaultRowRenderer } from 'react-virtualized';

export type RowRendererParams = {
  [key: string]: any;
};

export type A11yProps = {
  [key: string]: any;
};

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
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
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
          marginLeft: 18,
          height: 120,
          flexWrap: 'wrap',
        }}
        className='flex flex-col '
      >
        {Object.entries(rowData.extraInfo).map(([key, value]) => (
          <div key={key} style={{ flexBasis: '20%' }}>
            <span>{key}: </span>
            <span>{value as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
