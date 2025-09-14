import '../DashboardStyles.css';
import { useAuth } from '../context/AuthContext';



function ProfileContent() {


    const { user } = useAuth();

    return(
    <>
        <div className="profile-window">
            <div className='avatar'><img src='../src/assets/user.png'/></div>
            <h2 style={{fontSize: '42px'}}>{ user?.username }</h2>

         
        </div>
    </>
    )
}

export default ProfileContent;