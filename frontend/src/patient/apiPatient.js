


export const create = (userId, token, patient) => {
    return fetch(`${process.env.REACT_APP_API_URL}/patient/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: patient
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/patients`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const listByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/patients/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const remove = (patientId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/patient/${patientId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const singlePatient = patientId => {

    return fetch(`${process.env.REACT_APP_API_URL}/patient/${patientId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const update = (patientId, token, patient) => {
    
    return fetch(`${process.env.REACT_APP_API_URL}/patient/${patientId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: patient
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const uncomment = (userId, token, patientId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/patient/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, patientId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
