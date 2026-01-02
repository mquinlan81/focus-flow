import { useEffect, useRef, useState, useCallback } from 'react';
import TaskCard from './UI/TaskCard';
import NeuralToggle from './UI/NeuralToggle';

export default function Dashboard({ user, profile }) {
  const inputRef = useRef(null);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTheater, setActiveTheater] = useState('Professional');
  const [viewMode, setViewMode] = useState('today'); // 'today' or 'future'

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
          task: task, // Matches backend
          username: user, // FIX: Moved username to the top level
        }),
      });

      // Check if the server actually succeeded
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      // Reset local input and refresh the list
      setTask('');
      await fetchTasks();

      // If the AI categorized it into a different theater, switch to it!
      if (data.theater) {
        setActiveTheater(data.theater);
      }
    } catch (error) {
      console.error('Neural Link Failure:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMigrateTask = async (taskId, daysOut) => {
    // 1. Force daysOut to be a number, default to 1 if it's missing/broken
    const moveAmount = typeof daysOut === 'number' ? daysOut : 1;

    try {
      const targetDate = new Date();
      // 2. Safer date math
      targetDate.setDate(targetDate.getDate() + moveAmount);

      // 3. Manual formatting to ensure it's a clean YYYY-MM-DD string
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dd = String(targetDate.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      console.log(`MIGRATION LOG -- ID: ${taskId} | Target: ${dateStr}`);

      const response = await fetch(
        `http://localhost:8000/tasks/${taskId}/migrate`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheduled_date: dateStr }),
        }
      );

      if (response.ok) {
        await fetchTasks();
      } else {
        console.error('Server rejected migration. Check Python logs.');
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
  };

  const handleReactivateTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/tasks/${taskId}/reactivate`,
        {
          method: 'PATCH',
        }
      );

      if (response.ok) {
        await fetchTasks(); // Refresh the list
      }
    } catch (error) {
      console.error('Reactivation failed:', error);
    }
  };

  // Filter history based on the active tab
  const todayStr = new Date().toISOString().split('T')[0];

  const todayTasks = tasks.filter((t) => {
    const cleanStatus = String(t.status || '')
      .trim()
      .toLowerCase();
    const cleanDate = String(t.scheduled_date || '').split(' ')[0]; // Removes time if it exists
    return cleanDate <= todayStr && cleanStatus === 'pending';
  });

  const futureTasks = tasks.filter((t) => {
    const cleanStatus = String(t.status || '')
      .trim()
      .toLowerCase();
    const cleanDate = String(t.scheduled_date || '').split(' ')[0];
    return cleanDate > todayStr && cleanStatus === 'pending';
  });

  const completedTasks = tasks.filter((t) => {
    const cleanStatus = String(t.status || '')
      .trim()
      .toLowerCase();
    return cleanStatus === 'complete';
  });

  console.log('--- DEBUG RESULTS ---');
  console.log('Today:', todayTasks.length);
  console.log('Future:', futureTasks.length);
  console.log('Completed:', completedTasks.length);

  // 3. Select the box based on the current viewMode
  // IMPORTANT: Ensure these match your useState('today') casing!
  let currentBox = [];
  if (viewMode === 'today') {
    currentBox = todayTasks;
  } else if (viewMode === 'future') {
    currentBox = futureTasks;
  } else if (viewMode === 'completed') {
    currentBox = completedTasks;
  }

  // 4. Final filter for the Theater (Professional/Personal/etc) and sort by date
  // 4. Final filter for the Theater - Forced lowercase comparison
  const filteredHistory = currentBox
    .filter((item) => {
      const taskTheater = String(item.theater || '')
        .trim()
        .toLowerCase();
      const currentActive = String(activeTheater || '')
        .trim()
        .toLowerCase();
      return taskTheater === currentActive;
    })
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));

  // 5. Create the counts for your NeuralToggle
  const timelineCounts = {
    today: todayTasks.length,
    future: futureTasks.length,
    completed: completedTasks.length,
  };

  // const filteredHistory = tasks
  //   .filter((item) => {
  //     const isDateMatch =
  //       viewMode === 'today'
  //         ? item.scheduled_date <= todayStr
  //         : item.scheduled_date > todayStr;
  //     return (
  //       item.theater === activeTheater &&
  //       isDateMatch &&
  //       item.status === 'pending'
  //     );
  //   })
  //   .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));

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
      <NeuralToggle
        options={['professional', 'domestic', 'personal']}
        active={activeTheater}
        onChange={setActiveTheater}
      />

      <NeuralToggle
        options={['today', 'future', 'completed']}
        active={viewMode}
        onChange={setViewMode}
        counts={timelineCounts}
      />

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
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
              onMigrate={handleMigrateTask}
              onReactivate={handleReactivateTask}
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
