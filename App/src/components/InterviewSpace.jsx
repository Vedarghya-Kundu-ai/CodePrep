import '../css/InterviewSpace.css';
import Editor from '@monaco-editor/react';
import micIcon from '../assets/microphone.png';
import waveimg from '../assets/message.png';
import Vapi from '@vapi-ai/web';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function InterviewSpace() {
    const [code, setCode] = useState("");
    const [assistantTranscription, setAssistantTranscription] = useState("")
    const [userTranscription, setUserTranscription] = useState("")
    const [interviewActive, setInterviewActive] = useState(false);
    const vapiref = useRef(null);
    const location = useLocation();
    const { question } = location.state || {};
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const vapi = new Vapi("4daa5c7d-b903-488c-bbdd-8e3b21e46831");
        vapiref.current = vapi;
        vapiref.current.on('message', (message) => {
            if(message.role == "assistant"){
                setAssistantTranscription(prev => message.transcript);
            }
            else if(message.role == "user"){
                setUserTranscription(prev => message.transcript);
            }
            else{
                setAssistantTranscription(prev => "");
                setUserTranscription(prev => "");
            }
        });
    }, []);

    const assistantoverrides = {
        recordingEnabled: false,
        variableValues: {
            question: question,
        },
        
    };
    
    const handleMicClick = () => {
        if(interviewActive == true) {
            return ;
        } else {
            if(!question) {
                alert("Please enter a question in your Dashboard to start the interview");
                setInterviewActive(false);
                navigate("/Dashboard");
                return ;
            } else {
                setInterviewActive(true);
                vapiref.current.start("fac7a826-d3a8-4fdd-928c-e5289074ae3d", assistantoverrides);
            }
        }
    };

    const endCall = () =>{
        //vapiref.current.say("Our time's up, goodbye!", true);
        vapiref.current.say("Goodbye!");
        if (confirm("Are you sure you want to end the call?")) {
            navigate("/Dashboard");
            vapiref.current.stop();
        } else {
            // User clicked Cancel
            return ;
        }
    };

    const handleSubmit = () =>{
        const message = code.toString();
        vapiref.current.send({
            type: 'add-message',
            message: {
                role: 'user',
                content: message,
            },
        });
    // 2) Force the assistant to generate & speak a reply
        vapiref.current.send({
        type: 'response.create',
        response: {conversation: 'continue'},
        });
    };

    return(
        <div className="min-h-screen flex flex-row justify-center items-center gap-8 px-8 mt-8">
            <div className="flex flex-col flex-1 gap-4 h-full">
                <div className="flex-1  flex flex-col items-center justify-center gap-5 bg-[#2d2f43] p-8 rounded-lg shadow-md">
                    <div className="flex justify-center items-center">
                        <img src={waveimg} className="object-contain w-[120px]" alt="animated-gif" />
                    </div>
                    <h2 className='text-l font-bold text-white text-xl mb-3'>AI Interviewer</h2>
                    {/* Show Bot transcription */}
                    <div className='display-transcript'>
                        <p className='transcription-sententence'>{assistantTranscription}</p>
                    </div>
                </div>

                <div className="flex-1  flex flex-col items-center justify-center gap-5 bg-[#2d2f43] p-8 rounded-lg shadow-md">
                    <img
                        src={micIcon}
                        alt="Mic"
                        className="object-contain w-[120px] cursor-pointer transition-transform transform active:scale-110"
                        onClick={handleMicClick}
                    />
                    <button className='cursor-pointer px-2 py-1 rounded-xl font-medium bg-[#e63946] transition-transform transform active:scale-110 mb-3' onClick={endCall}>End Call</button>
                    <div className='display-transcript'>
                        <p className='transcription-sententence'>{userTranscription}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-2 justify-center items-center overflow-hidden bg-[#161b22] gap-4 rounded-lg shadow-md p-2 h-full">
                <h2 className='text-3xl font-bold text-[#58a6ff] mt-2'>Code Editor</h2>
                <Editor
                height="392px"
                defaultLanguage="python"
                defaultValue="#Start coding here...."
                options={{ fontSize: 16 }}
                theme="vs-dark"
                onChange={(value) => setCode(value ?? "")}
                />
                <button
                onClick={handleSubmit}
                className="
                    relative inline-flex items-center justify-center
                    cursor-pointer
                    px-5 py-2 min-w-[132px]
                    rounded-lg
                    font-semibold text-sm text-[#eaeaea]
                    transition-all duration-200 ease-in-out
                    active:scale-95
                    bg-[#0e639c]
                    border-2 border-transparent
                    bg-clip-padding
                    before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-[#3794ff] before:to-[#1177bb] before:-z-10
                "
                >
                Submit
                </button>
            
            </div>
        </div>
    )
}

export default InterviewSpace;

