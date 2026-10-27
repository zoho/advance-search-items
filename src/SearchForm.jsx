import React, { useState } from 'react';

function SearchForm(props) {
  let [showMore, setShowMore] = useState(false);
  let filters = props.filters;

  function changeFilter(event) {
    props.onFilterChange(event.target.name, event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onSearch();
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-grid">
        <label className="field">
          <span className="field-label">Item Name</span>
          <input name="name_contains" type="text" placeholder="e.g. Books Test" value={filters.name_contains || ''} onChange={changeFilter} />
        </label>
        <label className="field">
          <span className="field-label">SKU</span>
          <input name="sku_contains" type="text" placeholder="SKU" value={filters.sku_contains || ''} onChange={changeFilter} />
        </label>
        <label className="field">
          <span className="field-label">Description</span>
          <input name="description_contains" type="text" placeholder="Description" value={filters.description_contains || ''} onChange={changeFilter} />
        </label>
        <label className="field">
          <span className="field-label">Rate</span>
          <input name="rate" type="number" placeholder="Selling rate" value={filters.rate || ''} onChange={changeFilter} />
        </label>
        <label className="field">
          <span className="field-label">Purchase Rate</span>
          <input name="purchase_rate" type="number" placeholder="Purchase rate" value={filters.purchase_rate || ''} onChange={changeFilter} />
        </label>
        <label className="field">
          <span className="field-label">Status</span>
          <select name="filter_by" value={filters.filter_by || ''} onChange={changeFilter}>
            <option value="">All</option>
            <option value="Status.Active">Active</option>
            <option value="Status.Inactive">Inactive</option>
          </select>
        </label>
      </div>

      {showMore ? (
        <div className="search-grid extra-grid">
          <label className="field">
            <span className="field-label">EAN</span>
            <input name="ean" type="text" value={filters.ean || ''} onChange={changeFilter} />
          </label>
          <label className="field">
            <span className="field-label">UPC</span>
            <input name="upc" type="text" value={filters.upc || ''} onChange={changeFilter} />
          </label>
          <label className="field">
            <span className="field-label">MPN</span>
            <input name="part_number" type="text" value={filters.part_number || ''} onChange={changeFilter} />
          </label>
          <label className="field">
            <span className="field-label">ISBN</span>
            <input name="isbn" type="text" value={filters.isbn || ''} onChange={changeFilter} />
          </label>
          <label className="field">
            <span className="field-label">Serial Numbers</span>
            <input name="serial_number" type="text" value={filters.serial_number || ''} onChange={changeFilter} />
          </label>
        </div>
      ) : null}

      <div className="search-actions">
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" className="btn btn-secondary" onClick={props.onClear}>Clear</button>
        <button
          type="button"
          className="link-btn"
          onClick={function () {
            setShowMore(!showMore);
          }}
        >
          {showMore ? 'Hide extra filters' : 'More filters'}
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
