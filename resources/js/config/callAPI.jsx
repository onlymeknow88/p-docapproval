import axios from 'axios';

export default async function callAPI({ url, method, data, token }) {
    let headers = {};
    if (token) {
        const tokenCookies = sessionStorage.getItem('token');

        if (tokenCookies) {
            const passportToken = tokenCookies;
            headers = {
                Authorization: `Bearer ${passportToken}`,
                'Content-Type': 'multipart/form-data',
            };
        }
    }
    const response = await axios({
        url,
        method,
        data,
        headers,
    }).catch((err) => err.response);

    if (response.status > 300) {
        const res = {
            error: true,
            message: response.data.message,
            data: response.data.data,
        };
        return res;
    }

    const { length } = Object.keys(response.data);
    const res = {
        error: false,
        message: 'success',
        data: length > 1 ? response.data : response.data.data,
    };

    return res;
}
