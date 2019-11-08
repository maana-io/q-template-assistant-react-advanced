import React from 'react'
import logo from './logo.svg'
import './App.css'
import AssistantAPIClient from '@io-maana/q-assistant-client'
require('dotenv').config()

console.log(
  'Your example env. variable { REACT_APP_VAR } is set to: ',
  process.env.REACT_APP_VAR
)

async function addFunctionNode() {
  const createFunctionInput = {
    name: 'assistantGeneratedFunction',
    arguments: [],
    outputType: 'STRING',
    graphqlOperationType: 'QUERY',
    functionType: 'CKG'
  }

  const func = await AssistantAPIClient.createFunction(createFunctionInput)
  const ws = await AssistantAPIClient.getWorkspace()
  const ag = await ws.getActiveGraph()
  const node = await ag.addNode('Function', func)
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Hello, Workspace!</h1>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button
          onClick={() => {
            addFunctionNode()
          }}
        >
          Add a Function Node!
        </button>
      </header>
    </div>
  )
}

export default App
