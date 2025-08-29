import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import '../css/History.css';

function History() {
    const [questions, setQuestions] = useState([]);
    const {currentUser} = useAuth();
    const userId = currentUser.uid;

    useEffect(() => {
        if(currentUser) {
            axios.get(`http://127.0.0.1:8000/questions/${userId}`)
            .then(res => {
                setQuestions(res.data);
            })
        }
    }, [currentUser])

    async function handleDelete(id) {
        try {
            await axios.delete(`http://127.0.0.1:8000/questions/${currentUser.uid}/${id}`);
            setQuestions((prev) => prev.filter(q => q.id !== id));

        } catch (error) {
            console.log("couldn't delete question", error);
        }
    }

    return (
        <>
            <div className="history-container">
                <h1 className="history-heading">History</h1>
                <div className="history-spacer"></div>
                <div className="questions-list">
                    <ul>
                        {questions.map((q, index) => {
                            return (
                                <li className="list-object" key={index}>
                                    <span>{q.question}</span>
                                    <button className="remove-history" onClick={() => handleDelete(q.id)}>remove</button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default History