const authToken = localStorage.getItem('token');
export const fetchMethods = {

    methodGetCards: {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    },


    methodDeleteCards: {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    },

    methodPostCard: {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    },


    methodFetchLogin: {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }
};