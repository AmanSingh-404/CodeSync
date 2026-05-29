import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

const App = () => {
  const [editor, setEditor] = useState(null);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });

  const [users, setUsers] = useState([]);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const name = e.target.username.value.trim();

    if (name) {
      window.history.pushState({}, "", "?username=" + encodeURIComponent(name));
      setUsername(name);
    }
  };

  useEffect(() => {
    if (!editor) return;

    const provider = new SocketIOProvider(
      "http://localhost:3000",
      "monaco",
      ydoc,
      { autoConnect: true }
    );

    provider.awareness.setLocalStateField("user", { name: username });
    
    provider.awareness.on("change", () => {
      const connectedUsers = Array.from(provider.awareness.getStates().values());
      setUsers(
        connectedUsers
          .map((state) => state.user)
          .filter((user) => Boolean(user?.name))
      );
    });

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    return () => {
      provider.disconnect();
      binding.destroy();
    };
  }, [editor, ydoc, yText, username]);

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-900 flex items-center justify-center">
        <form
          onSubmit={handleJoin}
          className="flex flex-col gap-4 bg-gray-800 p-6 rounded-xl w-80 shadow-2xl border border-gray-700"
        >
          <h1 className="text-2xl font-bold text-center text-white">
            Enter your username
          </h1>

          <input
            type="text"
            name="username"
            placeholder="Enter Your Username"
            className="p-2.5 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all border border-gray-600"
            required
          />

          <button
            type="submit"
            className="p-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-gray-950 font-bold transition-all cursor-pointer"
          >
            Join Room
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-black flex p-4 gap-4">
      <aside className="h-full w-1/4 bg-gray-800 rounded-lg p-4 text-white flex flex-col gap-4">
        <h2 className="text-xl font-bold border-b border-gray-700 pb-2">Users</h2>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {users.map((u, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="font-medium">{u.name}</span>
            </div>
          ))}
        </div>
      </aside>

      <section className="h-full w-3/4 bg-black rounded-lg overflow-hidden border border-gray-800">
        <Editor
          height="100%"
          theme="vs-dark"
          defaultLanguage="javascript"
          defaultValue="// Start coding..."
          onMount={handleMount}
        />
      </section>
    </main>
  );
};

export default App;