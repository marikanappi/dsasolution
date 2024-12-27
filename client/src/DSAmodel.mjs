function group(id, name, level, university, SLD, description, picture, numberOfPartecipants, joined) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.university = university;
    this.SLD = SLD;
    this.description = description;
    this.picture = picture;
    this.numberOfPartecipants = numberOfPartecipants;
    this.joined = joined;
}

function Challenge(title, group_id, topic_id) {
    this.title = title; // Titolo della challenge
    this.group_id = group_id; // ID del gruppo associato
    this.topic_id= topic_id; // ID del topic associato
}

// Aggiungiamo una domanda alla challenge
function Question (id, text) {
    this.id = id;
    this.text = text;
}

function Answer (id, text, is_correct, feedback) {
    this.id = id;
    this.text = text;
    this.is_correct = is_correct;
    this.feedback = feedback;
}

function Material (id, group_id, type, url, description){
    this.id = id;
    this.group_id = group_id;
    this.type = type;
    this.url = url;
    this.description = description;
}
export default group;

export { Challenge, Question, Answer, Material };
