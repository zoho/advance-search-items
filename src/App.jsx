import React, { useEffect, useState } from 'react';
import defaultColumns from './columns';
import SearchForm from './SearchForm';
import ColumnPicker from './ColumnPicker';
import ResultsTable from './ResultsTable';
import { loadColumnPrefs, saveColumnPrefs, searchItems, addItemsToInvoice } from './api';

function App(props) {
  let [filters, setFilters] = useState({});
  let [columns, setColumns] = useState(defaultColumns);
  let [items, setItems] = useState([]);
  let [page, setPage] = useState(1);
  let [hasMore, setHasMore] = useState(false);
  let [selectedIds, setSelectedIds] = useState([]);
  let [loading, setLoading] = useState(false);
  let [showColumns, setShowColumns] = useState(false);
  let [error, setError] = useState('');
  let [message, setMessage] = useState('');

  useEffect(function () {
    loadColumnPrefs(props.apiRootEndpoint, props.organizationId, props.userId).then(function (savedKeys) {
      if (savedKeys && savedKeys.length) {
        let nextColumns = defaultColumns.map(function (col) {
          return {
            key: col.key,
            label: col.label,
            show: savedKeys.indexOf(col.key) !== -1
          };
        });
        console.log('column pref applied to table', nextColumns.filter(function (col) {
          return col.show;
        }).map(function (col) {
          return col.key;
        }));
        setColumns(nextColumns);
      } else {
        console.log('column pref not applied, table keeps default columns', savedKeys);
      }
      runSearch(1, {});
    }).catch(function (err) {
      console.error(err);
      runSearch(1, {});
    });
  }, []);

  function runSearch(currentPage, currentFilters) {
    setPage(currentPage);
    setLoading(true);
    setError('');
    setMessage('');

    searchItems(props.apiRootEndpoint, props.organizationId, currentFilters, currentPage).then(function (result) {
      setItems(result.items);
      setHasMore(result.hasMore);
      setSelectedIds([]);
      setLoading(false);
    }).catch(function (err) {
      setItems([]);
      setError('Could not load items.');
      setLoading(false);
      console.error(err);
    });
  }

  function changeFilter(name, value) {
    let next = Object.assign({}, filters);
    next[name] = value;
    setFilters(next);
  }

  function clearFilters() {
    setFilters({});
    setItems([]);
    setSelectedIds([]);
    setPage(1);
    setHasMore(false);
    setError('');
    setMessage('');
  }

  function toggleColumn(key, checked) {
    setColumns(columns.map(function (col) {
      if (col.key === key) {
        return { key: col.key, label: col.label, show: checked };
      }
      return col;
    }));
  }

  function saveColumns() {
    let keys = [];
    columns.forEach(function (col) {
      if (col.show) {
        keys.push(col.key);
      }
    });

    if (keys.length === 0) {
      setError('Select at least one column.');
      return;
    }

    saveColumnPrefs(props.apiRootEndpoint, props.organizationId, props.userId, keys).then(function () {
      setMessage('Column preference saved.');
      setShowColumns(false);
    }).catch(function (err) {
      setError('Could not save column preference.');
      console.error(err);
    });
  }

  function toggleRow(itemId) {
    let index = selectedIds.indexOf(itemId);
    if (index === -1) {
      setSelectedIds(selectedIds.concat([itemId]));
    } else {
      setSelectedIds(selectedIds.filter(function (id) {
        return id !== itemId;
      }));
    }
  }

  function toggleAll() {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(function (item) {
        return item.item_id;
      }));
    }
  }

  function addSelected() {
    let lineItems = [];

    items.forEach(function (item) {
      if (selectedIds.indexOf(item.item_id) !== -1) {
        lineItems.push({
          item_id: item.item_id,
          name: item.name,
          description: item.description || '',
          rate: String(item.rate),
          quantity: '1'
        });
      }
    });

    if (lineItems.length === 0) {
      setMessage('Select at least one item.');
      return;
    }

    addItemsToInvoice(lineItems).then(function () {
      setMessage(lineItems.length + ' item(s) added to the invoice.');
      setSelectedIds([]);
    }).catch(function (err) {
      setError('Could not add items to the invoice.');
      console.error(err);
    });
  }

  let resultText = loading ? 'Searching…' : items.length + ' item(s) on this page';

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Item Search</h1>
          <p>Find items and add them to this invoice line.</p>
        </div>
      </header>

      <SearchForm
        filters={filters}
        onFilterChange={changeFilter}
        onSearch={function () {
          runSearch(1, filters);
        }}
        onClear={clearFilters}
      />

      <div className="toolbar">
        <span className="result-count">{resultText}</span>
        <div className="toolbar-right">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={function () {
              setShowColumns(!showColumns);
            }}
          >
            Columns
          </button>
          <ColumnPicker
            open={showColumns}
            columns={columns}
            onToggle={toggleColumn}
            onDone={saveColumns}
          />
        </div>
      </div>

      {error ? <div className="banner banner-error">{error}</div> : null}
      {message ? <div className="banner banner-info">{message}</div> : null}

      <ResultsTable
        items={items}
        columns={columns}
        selectedIds={selectedIds}
        loading={loading}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
      />

      <footer className="app-footer">
        <div className="pager">
          <button type="button" className="btn btn-secondary" disabled={page <= 1 || loading} onClick={function () { runSearch(page - 1, filters); }}>
            Previous
          </button>
          <span>Page {page}</span>
          <button type="button" className="btn btn-secondary" disabled={!hasMore || loading} onClick={function () { runSearch(page + 1, filters); }}>
            Next
          </button>
        </div>
        <button type="button" className="btn btn-primary" onClick={addSelected}>
          Add {selectedIds.length} selected
        </button>
      </footer>
    </div>
  );
}

export default App;
