import '../DashboardStyles.css';
import { useTravel } from '../context/TravelContext';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInDays } from 'date-fns';
import Weather from '../components/Weather';

function HeadSection() {
  const { travels, updateTravelDate, updateTravelBudget, fetchTodos, addTodo, toggleTodo } = useTravel();

  const [selectedTravel, setSelectedTravel] = useState<{
    id: number;
    title: string;
    date: string | null;
    budget?: number;
    saved?: number;
  } | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const [budget, setBudget] = useState<string>('');
  const [savedMoney, setSavedMoney] = useState<string>('');

  
  const [todos, setTodos] = useState<{ id: number; text: string; done: boolean }[]>([]);
  const [todoInput, setTodoInput] = useState<string>("");


  useEffect(() => {
    if (selectedTravel) {
      fetchTodos(selectedTravel.id).then(setTodos);
      setSelectedDate(selectedTravel.date ? new Date(selectedTravel.date) : null);

      setBudget(
        selectedTravel.budget !== undefined && selectedTravel.budget !== null
          ? String(selectedTravel.budget)
          : ''
      );
      setSavedMoney(
        selectedTravel.saved !== undefined && selectedTravel.saved !== null
          ? String(selectedTravel.saved)
          : ''
      );
    } else {
      setTodos([]);
      setBudget('');
      setSavedMoney('');
    }
  }, [selectedTravel]);

  const handleAddTodo = async () => {
    if (!selectedTravel || !todoInput.trim()) return;
    await addTodo(selectedTravel.id, todoInput.trim());
    const newTodos = await fetchTodos(selectedTravel.id);
    setTodos(newTodos);
    setTodoInput("");
  };

  const handleToggleTodo = async (todo: { id: number; done: boolean }) => {
    if (!selectedTravel) return;
    await toggleTodo(todo.id, !todo.done, selectedTravel.id);
    const newTodos = await fetchTodos(selectedTravel.id);
    setTodos(newTodos);
  };

  const handleTravelClick = (travel: typeof selectedTravel) => {
    setSelectedTravel(travel);
    setShowCalendar(false);
  };

const handleSaveBudget = () => {
  if (selectedTravel) {
    updateTravelBudget(
      selectedTravel.id,
      Number(budget) || 0,
      Number(savedMoney) || 0
    );
    setSelectedTravel({
      ...selectedTravel,
      budget: Number(budget) || 0,
      saved: Number(savedMoney) || 0,
    });
    setBudget('');
    setSavedMoney('');
  }
};

  const handleDateClick = () => {
    setShowCalendar((prev) => !prev);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setShowCalendar(false);
    if (selectedTravel && date) {
      updateTravelDate(selectedTravel.id, date.toISOString());
    }
  };

  return (
    <section className='head-section'>
      <div className='travel-list'>
        <h2>Dina resor</h2>
        <ul>
          {travels.map((travel) => (
            <li
              key={travel.id}
              onClick={() => handleTravelClick(travel)}
              style={{
                cursor: "pointer",
                fontWeight: selectedTravel?.id === travel.id ? "bold" : "normal",
              }}
            >
              {travel.title}
            </li>
          ))}
        </ul>
      </div>
      <div className='travel-details'>
        {selectedTravel && (
          <div className='travel-info'>
            <h3>{selectedTravel.title}</h3>
            <div className='clock-progress-bar'>
              <div
                className='date-clock'
                onClick={handleDateClick}
                style={{ position: 'relative', cursor: 'pointer', marginBottom: 16 }}
              >
                {selectedDate ? (
                  <p style={{ textAlign: 'center', padding: '10px', fontSize: '20px' }}>
                    Det är {differenceInDays(selectedDate, new Date())} dagar kvar till {' '}
                     {selectedDate.toLocaleDateString()}{" "}
                  </p>
                ) : (
                  <p style={{ textAlign: 'center', padding: '10px', fontSize: '20px' }}>
                    Klicka för att välja resedatum
                  </p>
                )}
                {showCalendar && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '60px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 1000,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      inline
                      minDate={new Date()}
                    />
                  </div>
                )}
              </div>
              <Weather title={selectedTravel?.title || ""} />
              <div className='progress-content'>
                <p className='progress-text'>
                  Sparade pengar: {savedMoney} kr<br />
                  Din budget      {budget} kr
                </p>
                <div className='progress-bar'>
                  <div
                    className='progress-fill'
                    style={{
                      width:
                        budget && Number(budget) > 0
                          ? `${Math.min((Number(savedMoney) / Number(budget)) * 100, 100)}%`
                          : "0%",
                    }}
                  ></div>
                </div>
                <div className='budget-buttons'>
                  <input
                    type='number'
                    className='btn-budget input-budget'
                    value={budget}
                    min={0}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Vad är din budget?"
                  />
                  <input
                    type='number'
                    className='btn-budget input-budget'
                    value={savedMoney}
                    min={0}
                    onChange={(e) => setSavedMoney(e.target.value)}
                    placeholder="Hur mycket vill du spara?"
                  />
                  <button onClick={handleSaveBudget} className='btn-budget save-budget-btn'>
                    Spara
                  </button>
                </div>
              </div>
            </div>
            <div className='to-do-list'>
              <div style={{ position: "relative", padding: "16px 0 0 0" }}>
                <input
                  type="text"
                  placeholder="Lägg till uppgift..."
                  value={todoInput}
                  onChange={e => setTodoInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleAddTodo(); }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "60%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1.5px solid #37a4cc",
                    fontSize: "16px",
                    background: "#f7fafd"
                  }}
                />
                <ul style={{ listStyle: "none", padding: 0, marginTop: 40, display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap" }}>
                  {todos.map((todo) => (
                    <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => handleToggleTodo(todo)}
                        style={{ accentColor: "#37a4cc", width: 18, height: 18 }}
                      />
                      <span style={{
                        textDecoration: todo.done ? "line-through" : "none",
                        color: todo.done ? "#aaa" : "#222",
                        fontSize: "16px",
                        background: "#fff",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        boxShadow: "0 1px 4px rgba(55,122,153,0.07)"
                      }}>
                        {todo.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeadSection;