import '../formStyle.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
    const { login } = useAuth();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {

                login(data.user);
                setErrorMsg('');
            } else {
                setErrorMsg(data.error || 'Inloggningsfel');
            }
        } catch (error) {
            setErrorMsg('Fel vid anslutning till servern)');
        }
    };


    return (
        <>
            <form id='form' onSubmit={handleSubmit}>
                      <h2>Logga in</h2>
                <div>
                    <label htmlFor="username">Användarnamn:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Lösenord:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <input type="submit" value="Login" />
            </form>
            {errorMsg && <p className='message-error' style={{ color: 'red'}}>{errorMsg}</p>}
        </>
    );
}

export default LoginForm;

