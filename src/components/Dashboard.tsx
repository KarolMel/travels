import Navbar from './Navbar';
import HeadSection from './MainSection';
import ProfileContent from './ProfieContent';
import AddTravelForm from './AddTravelForm';
import { useState } from 'react';
import '../DashboardStyles.css';
import { useAuth } from '../context/AuthContext';
import { TravelProvider } from '../context/TravelContext';

function Dashboard() {
  const { user } = useAuth();

  const [profileIsVisible, setProfileIsVisible] = useState<boolean>(false);
  const [addTravelFormIsVisible, setTravelFormIsVisible] = useState<boolean>(false);

  if (!user) return <p>Du måste logga in</p>;

  return (
    <TravelProvider userId={user.id}>
      <main>
        <Navbar 
          profileIsVisible={profileIsVisible} 
          setProfileIsVisible={setProfileIsVisible} 
          addTravelFormIsVisible={addTravelFormIsVisible} 
          setAddTravelFormIsVisible={setTravelFormIsVisible}
        />
        <div className={`profile-slide ${profileIsVisible ? 'open' : ''}`}>
          <ProfileContent />
        </div>
        <HeadSection />
        <div className={`add-travel-form-slide ${addTravelFormIsVisible ? 'open' : ''}`}>
          <AddTravelForm setTravelFormIsVisible={setTravelFormIsVisible} />
        </div>
      </main>
    </TravelProvider>
  );
}

export default Dashboard;
