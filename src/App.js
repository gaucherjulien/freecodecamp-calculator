import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const W=40;
const H=40;
const M=2;

const MODEL = {
  '0': ['0',      'zero'],
  '1': ['1',      'one'],
  '2': ['2',      'two'],
  '3': ['3',      'three'],
  '4': ['4',      'four'],
  '5': ['5',      'five'],
  '6': ['6',      'six'],
  '7': ['7',      'seven'],
  '8': ['8',      'eight'],
  '9': ['9',      'nine'],  
  '.': ['.',      'decimal'],
  
  '+': ['+',      'add'],
  '-': ['-',      'subtract'],
  '*': ['*',      'multiply'],
  '/': ['/',      'divide'],
  
  'C': ['Escape', 'clear'],
  '=': ['=',      'equals'],
};

const VUE = [
  ['7', '8', '9', '+'], 
  ['4', '5', '6', '-'], 
  ['1', '2', '3', '*'], 
  ['0', '.', '=', '/'], 
  ['C'], 
];

function App() {

  const [display, setDisplay] = useState (["", "0", '']);
  const [equals, toggleEquals] = useState (false);

  const [history, setHistory] = useState ("");

  function updateListener(event){

    const ret = Object.entries (MODEL).map (([k,v]) => {
      if ((event.key.toUpperCase()==k) || (event.key==v[0])) {
        update (k);
      }
    });
  }

  useEffect (() => {
    document.addEventListener("keydown", updateListener, false);
    return () => {
      document.removeEventListener("keydown", updateListener, false);
    }
  });

  function update (key)
  {
    try
    {
      setHistory (history+key);

      if (key === 'C') {
        setDisplay (["", "0", '']);
      }

      else if ('0123456789.'.includes (key))
      {
        let number = equals ? '' : display[1];

        if (key == '.' && number.includes ('.')) {
          return;
        }

        if (number == '0') {
          number = '';
        }

        number += key;
        setDisplay ([display[0] + display[2], number, '']);
      }

      else if ('+-*/'.includes (key))
      {
        const opt = display[2] + key;
        let op = '';
        let e = false;
        for (let i = opt.length-1; i >= 0; --i)
        {
          let c = true;
          if ('+*/'.includes (key))
          {
            if (e) {
              c = false;
            }
            e = true;
          }
          if (c) {
            op = opt[i] + op;
          }
        }

        setDisplay ([display[0] + display[1], '', op]);
      }

      else if (key == '=')
      {
        const res = eval (display[0] + display[1] + display[2]);
        setDisplay (["", res, '']);
      }
    }

    finally {
      toggleEquals (key == '=')
    }
  }

  return (
    <div className="App">
      {
        VUE.map ((V2) => {
          return (
            <div>
            {
              V2.map ((key) => {
                return (
                  <button 
                    id={MODEL[key][1]}
                    style={{width:W, height:H, margin:M}}
                    onClick={() => update (key)}
                  >
                  {key}</button>)
              })
            }
            </div>
          )
        })
      }
        <div>
          {/* <div id="display">{input}</div>
          <div>{output}</div> */}
          <div id="display">{display[0]}{display[1]}{display[2]}</div>
          {/* <div id="display">{history}</div> */}
        </div>
    </div>
  );
}

export default App;

// CCCCCCCC5*1+5+92=CC123C3+5*6-2/4=5-9+5=C000C5..0C5.5.5C10.5-5.5=5*5.5=C5*-5=C5-2=/2=5+5=+3=C2/7=CC
