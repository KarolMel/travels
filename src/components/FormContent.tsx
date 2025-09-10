import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import '../formStyle.css';

function FormContent() {
    const [isLoginButtonClick, setIsLoginButtonClick] = useState<boolean>(false);
    const [isRegisterButtonClick, setIsRegisterButtonClick] = useState<boolean>(false);

    const handleLoginButtonClick = () => {
        setIsLoginButtonClick(true);
        setIsRegisterButtonClick(false);
    };

    const handleRegisterButtonClick = () => {
        setIsRegisterButtonClick(true);
        setIsLoginButtonClick(false);
    };

    const handleCloseForm = () => {
        setIsLoginButtonClick(false);
        setIsRegisterButtonClick(false);
    };

    return (
        <>
        <div className='start-page'>
            {!isLoginButtonClick && !isRegisterButtonClick && (
                <>
                        <h1>TRAVEL<span style={{color: 'lightgreen'}}>ON</span> <img style={{height: '38px', position: 'absolute', marginLeft: '8px', marginTop: '2px'}} src='../src/assets/mountian.png'/></h1>
                
                <div className='buttons'>
                        <button onClick={handleLoginButtonClick} className='login-button'>Logga in</button>
                        <button onClick={handleRegisterButtonClick} className="register-button">Registrera</button>
                    </div></>
            )}

            {(isLoginButtonClick || isRegisterButtonClick) && (
                <div className="form-container">
                    <button className="close-button" onClick={handleCloseForm}>✕</button>
                    {isLoginButtonClick && <LoginForm />}
                    {isRegisterButtonClick && <RegisterForm onRegisterSuccess={handleCloseForm} />}
                </div>
            )}
            </div>
        </>
    );
}

export default FormContent;