import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';
import Navbar from './Navbar';
import { useAuth } from '../contexts/authContext';
import useSession from '../useSessions';

function Dashboard(){
    const [question, setQuestion] = useState("")
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { startSession } = useSession();
    const onSubmit = (e) => {
        if(!currentUser){
            navigate("/login");
        } else {
            e.preventDefault();
            startSession(question);
            navigate("/interviewSpace", { state: { question } });
        }
    }

    return (
        <>
        
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Ready to ace your next coding interview ?</h1>
            <h2 className='dashboard-subheading'>Built to prepare you for your next coding interview.</h2>
                <div className="question-space">
                    <form action="" onSubmit={onSubmit}>
                        <input 
                            type="text" 
                            placeholder="Enter your interview question here" 
                            required
                            onChange={(e) => setQuestion(e.target.value) }
                        />
                        <button >Submit</button>
                    </form>
                </div>
        </div>
        </>
    )
}
export default Dashboard;