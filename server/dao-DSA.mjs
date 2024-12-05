import { url } from 'inspector';
import db from './db.mjs';
import group from './DSAmodel.mjs';
import { Challenge } from './DSAmodel.mjs';

// Funzione per ottenere tutti i gruppi
export function getAllGroups(db) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM StudyGroups";
    
        db.all(query, [], (err, rows) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
    
            let groups = rows.map(row => {
                return new group(
                    row.id, 
                    row.name, 
                    row.level, 
                    row.university, 
                    row.SLD, 
                    row.description, 
                    row.picture, 
                    row.number_of_participants, 
                    row.joined
                );
            });
    
            resolve(groups); // Risolviamo la Promise con i gruppi ottenuti
        });
    });
}

// Funzione per ottenere tutte le sfide
export function getChallenges(db) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM Challenges";
    
        db.all(query, [], (err, rows) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
    
            let challenges = rows.map(row => {
                return new Challenge(
                    row.challenge_id,          // ID della sfida
                    row.question,              // Testo della domanda
                    {
                        correct: row.answer1_correct,  // Risposta 1 - corretto
                        text: row.answer1_text,      // Risposta 1 - testo
                        feedback: row.answer1_feedback // Risposta 1 - feedback
                    },
                    {
                        correct: row.answer2_correct,  // Risposta 2 - corretto
                        text: row.answer2_text,      // Risposta 2 - testo
                        feedback: row.answer2_feedback // Risposta 2 - feedback
                    },
                    {
                        correct: row.answer3_correct,  // Risposta 3 - corretto
                        text: row.answer3_text,      // Risposta 3 - testo
                        feedback: row.answer3_feedback // Risposta 3 - feedback
                    },
                    {
                        correct: row.answer4_correct,  // Risposta 4 - corretto
                        text: row.answer4_text,      // Risposta 4 - testo
                        feedback: row.answer4_feedback // Risposta 4 - feedback
                    }
                );
            });
    
            resolve(challenges); // Risolviamo la Promise con le sfide ottenute
        });
    });
}

// Funzione per ottenere i gruppi per un determinato label
export function getGroupByLabel(db, label) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM StudyGroups WHERE joined = ?";
    
        db.all(query, [label], (err, rows) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            // Mappiamo i gruppi ottenuti dalla query come oggetti
            let groups = rows.map(row => {
                return {
                    id: row.id,
                    name: row.name,
                    level: row.level,
                    university: row.university,
                    SLD: row.SLD,
                    description: row.description,
                    picture: row.picture,
                    number_of_participants: row.number_of_participants,
                    joined: row.joined
                };
            });
        
            resolve(groups); // Risolviamo la Promise con i gruppi ottenuti
        });
    });
}

//leave group:
export function leaveGroup(db, idGroup) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE StudyGroups SET joined = 0 WHERE id = ?";
    
        db.run(query, [idGroup], (err) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            resolve(); // Risolviamo la Promise
        });
    });
}

//join group:
export function joinGroup(db, idGroup) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE StudyGroups SET joined = 1 WHERE id = ?";
    
        db.run(query, [idGroup], (err) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            resolve(); // Risolviamo la Promise
        });
    });
}

//add group:
export function addGroup(db, name, level, university, SLD, description, picture, number_of_participants, joined) {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO StudyGroups (name, level, university, SLD, description, picture, number_of_participants, joined) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
        db.run(query, [name, level, university, SLD, description, picture, number_of_participants, joined], function(err) {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            resolve(this.lastID); // Risolviamo la Promise con l'ID dell'ultimo gruppo inserito
        });
    });
}

// Funzione per ottenere un gruppo per un determinato ID
export function getGroupById(db, name) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM StudyGroups WHERE name = ?";
    
        db.get(query, [name], (err, row) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            if (row === undefined) {
                reject(new Error("Not found")); // Rifiutiamo la Promise se non troviamo il gruppo
            }
        
            let group = new group(
                row.id, 
                row.name, 
                row.level, 
                row.university, 
                row.SLD, 
                row.description, 
                row.picture, 
                row.number_of_participants, 
                row.joined
            );
        
            resolve(group); // Risolviamo la Promise con il gruppo ottenuto
        });
    });
}

// Funzione per ottenere un gruppo per un determinato SLD
export function getGroupBySLD(db, SLD) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM StudyGroups WHERE SLD = ?";
    
        db.get(query, [SLD], (err, row) => {
            if (err) {
                return reject(err); // Rifiutiamo la Promise se c'è un errore
            }
        
            if (row === undefined) {
                reject(new Error("Not found")); // Rifiutiamo la Promise se non troviamo il gruppo
            }
        
            let group = new group(
                row.id, 
                row.name, 
                row.level, 
                row.university, 
                row.SLD, 
                row.description, 
                row.picture, 
                row.number_of_participants, 
                row.joined
            );
        
            resolve(group); // Risolviamo la Promise con il gruppo ottenuto
        });
    });
}
