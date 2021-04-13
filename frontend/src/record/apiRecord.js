export const create = (userId, token, record) => {
    return fetch(`${process.env.REACT_APP_API_URL}/record/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: record
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/records`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const listByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/records/by/${userId}`, {
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


export const singleRecord = recordId => {

    return fetch(`${process.env.REACT_APP_API_URL}/record/${recordId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const remove = (recordId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/record/${recordId}`, {
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

export const update = (recordId, token, record) => {
    
    return fetch(`${process.env.REACT_APP_API_URL}/record/${recordId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: record
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


