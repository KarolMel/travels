import '../DashboardStyles.css'; 
import { useAuth } from '../context/AuthContext'; 

interface Props {
    profileIsVisible: boolean;
    setProfileIsVisible: React.Dispatch<React.SetStateAction<boolean>>;

    addTravelFormIsVisible: boolean;
    setAddTravelFormIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar( { profileIsVisible, setProfileIsVisible, addTravelFormIsVisible, setAddTravelFormIsVisible }: Props) {
        const { logout } = useAuth();

        function toggleProfileWindow() {
            setProfileIsVisible(!profileIsVisible);
        }

        function toggleTravelForm() {
            setAddTravelFormIsVisible(!addTravelFormIsVisible)
        }

    return(
        <>
            <nav className="navigation-menu">
                <div className='nav-div logo'>TRAVEL<p style={{color: 'lightgreen'}}>ON</p> <img style={{height: '38px'}} src='../src/assets/mountian.png'/></div>
                <div className='nav-div add-new-travel' onClick={toggleTravelForm}>+</div>
                <div className='nav-div profile' onClick={toggleProfileWindow}>{!profileIsVisible ? 'VISA PROFIL' : 'DÖLJ PROFIL'}</div>
                <button className='log-out-btn' onClick={logout}>Logga ut</button>
            </nav>
        </>
    )
}

export default Navbar;

