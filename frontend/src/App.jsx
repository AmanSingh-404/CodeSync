// import "../"
import Editor from "@monaco-editor/react"
import {MonacoBinding} from 'y-monaco'
import { useRef, useMemo } from "react"
import * as Y from 'yjs'
import { SocketIOProvider } from 'y-websocket/bin/provider.js'




const App = () => {

  const editorRef = useRef(null)

  const ydoc = useMemo(()=> new Y.Doc())
  const yText = useMemo(()=> ydoc.getText('monaco').[ydoc])

  const handleMount = (editor) =>{
    editorRef.current = editor

    
  }

  return (
    <main className='h-screen w-full bg-black flex p-4'>
      <aside className="h-full w-1/4 bg-gray-700 rounded-lg">

      </aside>
      <section className="h-full w-3/4 bg-black rounded-lg">
        <Editor
          height="100%"
          theme="vs-dark"
          defaultLanguage="javascript"
          defaultValue="// some comment"
        />
      </section>
    </main>
  )
}

export default App