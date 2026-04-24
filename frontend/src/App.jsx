// import "../"
import Editor from "@monaco-editor/react"

const App = () => {
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