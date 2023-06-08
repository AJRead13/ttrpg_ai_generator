import React, { useState } from 'react';

const Main = () => {
  const [searches, setSearches] = useState([]);

  const handleSearch = (type) => {
    const newSearch = {
      type: type,
      ruleset: 'Default',
      theme: 'Default',
    };
    setSearches([newSearch, ...searches]);
  };

  return (
    <main className="container mt-4">
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search..." />
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="rulesetSelect">Rulesets:</label>
          <select className="form-select" id="rulesetSelect">
            <option defaultValue>Default</option>
            <option>Ruleset 1</option>
            <option>Ruleset 2</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="themeSelect">Themes:</label>
          <select className="form-select" id="themeSelect">
            <option defaultValue>Default</option>
            <option>Theme 1</option>
            <option>Theme 2</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <h5>Rulesets:</h5>
        <div className="btn-group me-2" role="group">
          <button type="button" className="btn btn-primary" onClick={() => handleSearch('animal')}>Animal</button>
          <button type="button" className="btn btn-primary" onClick={() => handleSearch('magic item')}>Magic Item</button>
          <button type="button" className="btn btn-primary" onClick={() => handleSearch('town')}>Town</button>
          <button type="button" className="btn btn-primary" onClick={() => handleSearch('npc')}>NPC</button>
        </div>
      </div>
      <div>
        <h5>Search Results:</h5>
        <ul className="list-group">
          {searches.map((search, index) => (
            <li className="list-group-item" key={index}>
              <strong>Type:</strong> {search.type}, <strong>Ruleset:</strong> {search.ruleset}, <strong>Theme:</strong> {search.theme}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Main;
