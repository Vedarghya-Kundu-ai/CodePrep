import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";

function History() {
  const [questions, setQuestions] = useState([]);
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  useEffect(() => {
    if (currentUser) {
      axios.get(`http://127.0.0.1:8000/questions/${userId}`)
        .then(res => {
          setQuestions(res.data);
        });
    }
  }, [currentUser]);

  async function handleDelete(id) {
    try {
      await axios.delete(`http://127.0.0.1:8000/questions/${currentUser.uid}/${id}`);
      setQuestions((prev) => prev.filter(q => q.id !== id));
    } catch (error) {
      console.log("couldn't delete question", error);
    }
  }

  return (
    <div className="min-h-screen text-white p-6 mt-15">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">History</h1>

        {/* List */}
        {questions.length === 0 ? (
          <p className="text-gray-400 text-center">No history found.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q) => (
              <li
                key={q.id}
                className="flex items-center justify-between bg-[#1c1f2e] p-4 rounded-lg shadow-md hover:bg-[#24283a] transition"
              >
                <span className="text-gray-200">{q.question}</span>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="cursor-pointer ml-4 px-4 py-2 bg-red-500 hover:bg-red-500 rounded-md text-sm font-medium transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default History;
