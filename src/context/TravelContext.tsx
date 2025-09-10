import { createContext, useState, useContext, useEffect, type ReactNode } from "react";

interface Travel {
  id: number;
  title: string;
  date: string | null;
  budget?: number;
  saved?: number;
}

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TravelContextType {
  travels: Travel[];
  addTravel: (title: string) => void;
  updateTravelDate: (id: number, date: string) => void;
  updateTravelBudget: (id: number, budget: number, saved: number) => void;
  fetchTravels: () => void;

  fetchTodos: (travelId: number) => Promise<Todo[]>;
  addTodo: (travelId: number, text: string) => Promise<Todo>;
  toggleTodo: (todoId: number, done: boolean, travelId: number) => Promise<void>;
}

interface TravelProviderProps {
  children: ReactNode;
  userId: number | null;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider = ({ children, userId }: TravelProviderProps) => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [ ,setTodos] = useState<{ [travelId: number]: Todo[] }>({});

  const fetchTodos = async (travelId: number) => {
    const res = await fetch(`http://localhost:5000/travels/${travelId}/todos`);
    const data = await res.json();
    setTodos((prev) => ({ ...prev, [travelId]: data }));
    return data;
  };

  const addTodo = async (travelId: number, text: string): Promise<Todo> => {
    const res = await fetch(`http://localhost:5000/travels/${travelId}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to add todo");
    const newTodo: Todo = await res.json();
    await fetchTodos(travelId);
    return newTodo;
  };

  const toggleTodo = async (todoId: number, done: boolean, travelId: number) => {
    await fetch(`http://localhost:5000/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    await fetchTodos(travelId);
  };

  const fetchTravels = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/travels/${userId}`);
      if (!res.ok) throw new Error("Misslyckades med att hämta resor");
      const data = await res.json();
      setTravels(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTravel = async (title: string) => {
    if (!userId) return;
    try {
      const res = await fetch("http://localhost:5000/travels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title }),
      });
      if (!res.ok) throw new Error("Misslyckades med att lägga till resa");
      const data = await res.json();
      setTravels((prev) => [...prev, data]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTravelDate = async (id: number, date: string) => {
    try {
      const res = await fetch(`http://localhost:5000/travels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      if (!res.ok) throw new Error('Misslyckades med att uppdatera datum');
      fetchTravels();
    } catch (error) {
      console.error(error);
    }
  };

  const updateTravelBudget = async (id: number, budget: number, saved: number) => {
    try {
      const res = await fetch(`http://localhost:5000/travels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget, saved }),
      });
      if (!res.ok) throw new Error('Misslyckades med att uppdatera budgeten');
      fetchTravels();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTravels();
  }, [userId]);

  return (
    <TravelContext.Provider value={{
      travels,
      addTravel,
      updateTravelDate,
      updateTravelBudget,
      fetchTravels,
      fetchTodos,
      addTodo,
      toggleTodo,
    }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) throw new Error("useTravel måste användas inom en TravelProvider");
  return context;
};