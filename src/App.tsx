import React from 'react';
import { Game } from './Game';
import './App.css';

function App() {
  const queryParams = window.location.search.slice(1).split('&').filter((p) => !!p);
  const queryMap: { [key: string]: string | boolean } = {};
  for (const param of queryParams) {
    if (param.indexOf('=') > 0) {
      const parts = param.split('=');
      queryMap[parts[0]] = parts[1];
    } else {
      queryMap[param] = true;
    }
  }

  let rows: number | undefined;
  let columns: number | undefined;
  try {
    rows = queryMap['rows'] && typeof queryMap['rows'] === 'string'
      ? parseInt(queryMap['rows'])
      : undefined;
    columns = queryMap['columns'] && typeof queryMap['columns'] === 'string'
      ? parseInt(queryMap['columns'])
      : undefined;
  } catch {
    /* Swallow exception */
  }

  return (
    <Game
      rows={rows}
      columns={columns}
      oscillatorExample={!!queryMap['oscillator-example']}
    />
  );
}

export default App;
