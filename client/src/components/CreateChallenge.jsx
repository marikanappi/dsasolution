import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChallenge, getTopics } from '../../API.mjs';
import '../css/createChallenge.css';  // Import the CSS file
import { Challenge } from '../DSAmodel.mjs';
import { FaQuestionCircle } from 'react-icons/fa';

const NewChallenge = ({ setFooterOption, group }) => {
    const [title, setTitle] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [externalMaterial, setExternalMaterial] = useState(null); // To handle external material (PDF/images)
    const [numQuestions, setNumQuestions] = useState(1); // Default to 1 question
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();
    const [tooltipModal, setTooltipModal] = useState({ visible: false, text: "" });

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const fetchedTopics = await getTopics(group.id);
                if (fetchedTopics) {
                    setTopics(fetchedTopics);
                    setSelectedTopic(fetchedTopics[0]?.topic_id || ''); // Preselect the first topic if available
                }
            } catch (err) {
                console.error('Error fetching topics:', err);
            }
        };

        fetchTopics();
    }, [group.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //const challenge = { title, topic_id: selectedTopic, external_material: externalMaterial, num_questions: numQuestions };
        const challenge = new Challenge(title, group.id, selectedTopic);
        console.log ("titolo: ", challenge.title);
        console.log ("group.id: ", challenge.group_id);
        console.log ("selectedTopic: ", challenge.topic_id);
        const result = await createChallenge(challenge);
        if (result) {
            setFooterOption('Group');
            navigate('/challenges');
        } else {
            console.error('Failed to create challenge');
        }
    };

    const handleFileChange = (e) => {
        setExternalMaterial(e.target.files[0]); // Set the selected file (PDF or image)
    };

    return (
        <div className="challenge-container">
            <h2 className="title">Create a New Challenge</h2>
            <form onSubmit={handleSubmit} className="challenge-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter the title"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="topic">Topic</label>
                    <select
                        id="topic"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        required
                    >
                        {topics.map((topic) => (
                            <option key={topic.topic_id} value={topic.topic_id}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="externalMaterial">External Material
                        <FaQuestionCircle
                            className="help-icon ms-2"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                            setTooltipModal({
                                visible: true,
                                text: "You can attach PDF files or images.",
                            })
                            }
                        />
                    </label>
                    <input
                        type="file"
                        id="externalMaterial"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="numQuestions">Number of Questions</label>
                    <input
                        type="number"
                        id="numQuestions"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Create Challenge</button>
            </form>


            {tooltipModal.visible && (
                <div className="tooltip-modal">
                <p>{tooltipModal.text}</p>
                <button
                    className="create-group-button"
                    onClick={() => setTooltipModal({ visible: false, text: "" })}
                >
                    Close
                </button>
                </div>
            )}
        </div>
    );
};

export default NewChallenge;
