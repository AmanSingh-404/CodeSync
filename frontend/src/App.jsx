import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

const App = () => {
  const editorRef = useRef(null);

  const [username, setUsername] = useState(() => {
    return (
      new URLSearchParams(window.location.search).get("username") || ""
    );
  });

  const [users, setUsers] = useState([]);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;
  };

  const handleJoin = (e) => {
    e.preventDefault();

    const name = e.target.username.value.trim();

    if (!name) return;

    window.history.pushState({}, "", "?username=" + name);
    setUsername(name);
  };

  useEffect(() => {
    if (!username || !editorRef.current) return;

    const provider = new SocketIOProvider(
      "http://localhost:3000",
      "monaco",
      ydoc,
      { autoConnect: true }
    );

    provider.awareness.setLocalStateField("user", {
      username: username,
    });

    const updateUsers = () => {
      const states = Array.from(
        provider.awareness.getStates().values()
      );

      const connectedUsers = states
        .map((state) => state.user)
        .filter((user) => user?.username);

      setUsers(connectedUsers);
    };

    provider.awareness.on("change", updateUsers);

    const binding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );

    updateUsers();

    return () => {
      provider.awareness.off("change", updateUsers);
      binding.destroy();
      provider.disconnect();
    };
  }, [username, ydoc, yText]);

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-900 flex items-center justify-center">
        <form
          onSubmit={handleJoin}
          className="flex flex-col gap-4 bg-gray-800 p-6 rounded-xl w-80"
        >
          <h1 className="text-2xl font-bold text-center text-white">
            Enter your username
          </h1>

          <input
            type="text"
            name="username"
            placeholder="Enter Your Username"
            className="p-2 rounded-lg bg-gray-700 text-white outline-none"
          />

          <button
            type="submit"
            className="p-2 rounded-lg bg-amber-50 text-gray-950 font-bold"
          >
            Join Room
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-black flex p-4 gap-4">
      <aside className="h-full w-1/4 bg-gray-700 rounded-lg p-4 text-white">
        <h2 className="text-xl font-bold mb-4">Users</h2>

        <div className="flex flex-col gap-2">
          {users.map((user, index) => (
            <p key={index}>{user.username}</p>
          ))}
        </div>
      </aside>

      <section className="h-full w-3/4 bg-black rounded-lg overflow-hidden">
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