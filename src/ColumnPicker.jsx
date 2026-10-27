import React from 'react';

function ColumnPicker(props) {
  if (!props.open) {
    return null;
  }

  return (
    <div className="column-picker">
      <div className="column-picker-header">
        <strong>Columns</strong>
        <button type="button" className="link-btn" onClick={props.onDone}>Done</button>
      </div>
      {props.columns.map(function (col) {
        return (
          <label className="column-option" key={col.key}>
            <input
              type="checkbox"
              checked={col.show}
              onChange={function (event) {
                props.onToggle(col.key, event.target.checked);
              }}
            />
            {col.label}
          </label>
        );
      })}
    </div>
  );
}

export default ColumnPicker;
