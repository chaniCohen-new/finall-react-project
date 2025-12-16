import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const WordTable = () => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await fetch('YOUR_API_URL_HERE'); // הכנס את URL ה-API שלך כאן
                const data = await response.json();
                setWords(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchWords();
    }, []);

    return (
        <div className="container text-center mt-5">
            <h2 className="mb-4">Words from Server</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Word</th>
                        </tr>
                    </thead>
                    <tbody>
                        {words.map((word, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{word}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WordTable;