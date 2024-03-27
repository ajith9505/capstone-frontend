import axios from '../api/axios';
import { useDebugValue } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../components/auth/authSlice';

const useRefreshToken = () => {

    //const {setCredentials, dispatch, auth } = useAuth();

    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)

    const email = auth.email
    const password = auth.password

    const refresh = async () => {
        const response = await axios.get('/auth/refresh', {
            withCredentials: true
        });
        dispatch(setCredentials({ email, password, accessToken: response.data.accessToken }));

        return response.data.accessToken;
    }

    return refresh;
};

export default useRefreshToken;