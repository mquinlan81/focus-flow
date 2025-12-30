import { useEffect, useRef, useState, useCallback } from 'react';
import TaskCard from './UI/TaskCard';

export default function Dashboard({ user, profile }) {
  const inputRef = useRef(null);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTheater, setActiveTheater] = useState('Professional');

  // 1. Move fetchTasks outside of any other functions so it's "global" to the component
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${user}`); // 'user' is the username prop
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
    if (inputRef.current) inputRef.current.focus();
  }, [fetchTasks]);

  const handleAnalyze = async () => {
    if (!task) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: task,
          profile: { ...profile, username: user },
        }),
      });

      const data = await response.json();

      await fetchTasks();

      // UI SMARTS: Automatically switch to the tab where the AI put the task!
      setActiveTheater(data.theater);

      setTask('');
    } catch (error) {
      console.error('Neural Link Failure:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter history based on the active tab
  const filteredHistory = tasks
    .filter((item) => item.theater === activeTheater)
    .sort((a, b) => {
      // 1. Primary Sort: Priority (High comes first)
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (a.priority !== 'High' && b.priority === 'High') return 1;

      // 2. Secondary Sort: Date (Newest first)
      return new Date(b.created_at) - new Date(a.created_at);
    });

  // 2. Now handleMoveTask can "see" and call fetchTasks
  const handleMoveTask = async (taskId, targetTheater) => {
    await fetch('http://localhost:8000/tasks/move', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: Number(taskId),
        new_theater: targetTheater,
      }),
    });

    // This line was likely failing because fetchTasks wasn't in scope
    await fetchTasks();
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      await fetchTasks(); // Refresh the list from the DB
    } catch (error) {
      console.error('Deletion failed:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:8000/tasks/${taskId}/complete`, {
        method: 'PATCH',
      });
      await fetchTasks(); // Refresh to show the "✓" status
    } catch (error) {
      console.error('Completion failed:', error);
    }
  };

  return (
    <div className="w-full max-w-[450px] mx-auto space-y-6 animate-in fade-in duration-700">
      {/* HEADER SECTION (Your Original Logic) */}
      <div className="flex justify-between items-end border-b border-ffblue/20 pb-4">
        <div>
          {/* <h1 className="font-inter font-black text-2xl text-ffwhite tracking-tighter">
            FOCUS<span className="text-ffblue">FLOW</span>
          </h1> */}
          <p className="font-poppins text-[10px] text-ffblue uppercase tracking-[0.2em]">
            User: {user} // {profile.profession}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-ffblue/5 border border-ffblue/20 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-ffgreen rounded-full animate-pulse"></span>
          <span className="font-mono text-[9px] text-ffwhite/70">
            SYNC: OPTIMAL
          </span>
        </div>
      </div>

      {/* COMPACT INPUT SECTION */}
      <div className="bg-ffblue/5 border border-ffblue/20 p-4 rounded-2xl relative overflow-hidden">
        <textarea
          ref={inputRef}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter objective..."
          className="w-full h-20 bg-transparent text-ffwhite placeholder-ffwhite/20 outline-none resize-none font-poppins text-sm"
        />
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !task}
          className="w-full py-3 bg-ffblue text-ffwhite font-inter font-black text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 transition-all disabled:opacity-30"
        >
          {isAnalyzing ? 'Processing Neural Data...' : 'Transmit Objective'}
        </button>
      </div>

      {/* THEATER TABS (The New Logic) */}
      <div className="flex bg-ffblack border border-ffblue/10 rounded-2xl p-1">
        {['Professional', 'Domestic', 'Personal'].map((theater) => (
          <button
            key={theater}
            onClick={() => setActiveTheater(theater)}
            className={`flex-1 py-2 rounded-xl font-inter text-[9px] uppercase tracking-widest transition-all ${
              activeTheater === theater
                ? 'bg-ffblue/20 text-ffblue border border-ffblue/30'
                : 'text-ffwhite/30 hover:text-ffwhite/60'
            }`}
          >
            {theater}
          </button>
        ))}
      </div>

      {/* FILTERED FEED */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-inter font-bold text-[10px] text-ffaqua uppercase tracking-widest">
            {activeTheater} Feed
          </h3>
          <span className="text-[9px] font-mono text-ffwhite/20">
            {filteredHistory.length} Entries
          </span>
        </div>

        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <TaskCard
              key={item.id}
              item={item}
              onMove={handleMoveTask}
              onDelete={handleDeleteTask} // We'll define this next
              onComplete={handleCompleteTask} // We'll define this next
            />
          ))}
        </div>

        {filteredHistory.length === 0 && !isAnalyzing && (
          <div className="py-12 text-center border-2 border-dashed border-ffblue/5 rounded-3xl">
            <p className="text-ffwhite/20 text-[10px] uppercase tracking-widest font-mono">
              Theater Empty // Waiting for Input
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
