import '../css/InterviewSpace.css';
import Editor from '@monaco-editor/react';
import micIcon from '../assets/microphone.png';
import waveimg from '../assets/message.png';
import Vapi from '@vapi-ai/web';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import useSession from '../useSessions';

function InterviewSpace() {
    const [code, setCode] = useState("");
    const [assistantTranscription, setAssistantTranscription] = useState("")
    const [userTranscription, setUserTranscription] = useState("")
    const vapiref = useRef(null);
    const location = useLocation();
    const { question } = location.state || {};
    const { session, endSession } = useSession();
    
    useEffect(() => {
        const vapi = new Vapi("9926bab3-6e6e-4c86-8bb4-24a868cd7fc5");
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
        vapiref.current.start("67b22507-7da2-4f28-b34d-cd4d2e746454", assistantoverrides);
    };

    const endCall = () =>{
        //vapiref.current.say("Our time's up, goodbye!", true);
        vapiref.current.say("Goodbye!")
        endSession();
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
        <div className="container">
            <div className="left-panel">
                <div className="interview-space">
                    <div className="animated-gif">
                        <img src={waveimg} className="gif-img" alt="animated-gif" />
                    </div>
                    <h2 style={{marginTop: "-8px"}}>AI Interviewer</h2>
                    {/* Show Bot transcription */}
                    <div className='display-transcript'>
                        <p className='transcription-sententence'>{assistantTranscription}</p>
                    </div>
                </div>

                <div className="user-response">
                    <img
                        src={micIcon}
                        alt="Mic"
                        className="mic-button"
                        onClick={handleMicClick}
                    />
                    <button className='stop-btn' onClick={endCall}>End Call</button>
                    <div className='display-transcript'>
                        <p className='transcription-sententence'>{userTranscription}</p>
                    </div>
                </div>
            </div>
            <div className="code-editor">
                <h2>Code Editor</h2>
                <Editor
                height="80%"
                defaultLanguage="python"
                defaultValue="#Start coding here...."
                options={{ fontSize: 16 }}
                theme="vs-dark"
                onChange={(value) => setCode(value ?? "")}
                />
                <div className='submit-code-btn'>
                    <button onClick={handleSubmit}>Submit</button>
                </div>              
            </div>
        </div>
    )
}

export default InterviewSpace;

