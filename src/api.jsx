import axios from 'axios';

export default axios.create({
    baseURL: `http://103.207.1.123:3005/api`
});