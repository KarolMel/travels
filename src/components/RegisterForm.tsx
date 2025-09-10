import { useState } from "react";

function RegisterForm({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<any>('');

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registreringen lyckades! Du kan nu logga in!');
        onRegisterSuccess();
      } else {
        console.log(`Fel: ${data.error}`);
      }
    } catch (error) {
      console.error('Fel vid registreringen:', error);
    }
  };

  return (
<>
    <form id="form" onSubmit={handleSubmit}>
      <h2>Registrera dig</h2>
      <div>
        <label htmlFor="username">Användarnamn:</label>
        <input type="text" id="username" name="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Lösenord:</label>
        <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <input type="submit" value='Registrera'/>
    </form>
</>  
  );
}   

export default RegisterForm;