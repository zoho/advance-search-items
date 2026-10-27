import React from 'react';

function cellText(item, key) {
  let value = item[key];
  if (value === undefined || value === null || value === '') {
    return '—';
  }
  return String(value);
}

function ResultsTable(props) {
  let items = props.items;
  let columns = props.columns.filter(function (col) {
    return col.show;
  });
  let selectedIds = props.selectedIds;
  let allSelected = items.length > 0 && selectedIds.length === items.length;

  if (props.loading) {
    return <div className="empty-state">Loading items…</div>;
  }

  if (items.length === 0) {
    return <div className="empty-state">No items found. Try a different search.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="results-table">
        <thead>
          <tr>
            <th className="checkbox-col">
              <input type="checkbox" checked={allSelected} onChange={props.onToggleAll} />
            </th>
            {columns.map(function (col) {
              return <th key={col.key}>{col.label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {items.map(function (item) {
            let checked = selectedIds.indexOf(item.item_id) !== -1;
            return (
              <tr key={item.item_id} className={checked ? 'row-selected' : ''}>
                <td className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={function () {
                      props.onToggleRow(item.item_id);
                    }}
                  />
                </td>
                {columns.map(function (col) {
                  return <td key={col.key}>{cellText(item, col.key)}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
