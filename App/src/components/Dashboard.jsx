import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import useSession from '../useSessions';
import axios from 'axios';

function Dashboard(){
    const [question, setQuestion] = useState("")
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { startSession } = useSession();

    async function onSubmit(e) {
        e.preventDefault();
        if(!currentUser){
            navigate("/Login");
        } else {
            try {
                const response = await axios.post("http://127.0.0.1:8000/add_question", {
                    user: currentUser.uid,
                    question: question,
                });
            } catch (error) {
                console.log("couldn't add question`")
                console.log(error)
            }
            startSession(question);
            navigate("/interviewSpace", { state: { question } });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen  font-sans p-5 box-border">
            <style>{`
                @keyframes typing {
                    from { width: 0; }
                    to { width: 100%; }
                }
                .typing-animation {
                    white-space: nowrap;
                    overflow: hidden;
                    width: 0;
                    animation: typing 3s steps(30, end) forwards;
                }
                .typing-animation-delayed {
                    white-space: nowrap;
                    overflow: hidden;
                    width: 0;
                    animation: typing 3s steps(25, end) forwards;
                    animation-delay: 2.2s;
                }
            `}</style>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-400 text-center leading-relaxed mb-4 typing-animation">
                Ready to ace your next coding interview ?
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-4xl font-light text-white -mt-1 text-center leading-relaxed mb-10 typing-animation-delayed">
                Built to prepare you for your next coding interview.
            </h2>
            
            <div className="mt-4">
                <form onSubmit={onSubmit}>
                    <input 
                        type="text" 
                        placeholder="Enter your interview question here" 
                        required
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-96 md:w-[550px] min-h-[40px] px-4 py-5 rounded-xl border-2 border-gray-700 bg-white text-gray-900 text-lg font-medium outline-none transition-all duration-300 ease-in-out focus:border-blue-400 focus:shadow-[0_0_12px_rgba(88,166,255,0.7)] focus:scale-105 block box-border"
                    />
                    <button className="mt-6 block mx-auto w-40 py-3.5 border-none rounded-lg bg-gradient-to-br from-green-600 to-green-500 text-white font-bold text-lg cursor-pointer transition-all duration-300 ease-in-out hover:from-green-500 hover:to-green-400 hover:-translate-y-1 hover:scale-105">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Dashboard;