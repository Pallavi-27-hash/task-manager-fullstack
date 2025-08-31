import {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';



 export const  useUserAuth = () => {
    const navigate = useNavigate();
    const { user, loading,clearUser } = useContext(UserContext);
    useEffect(() => {
        if (user) return;
        if (loading) return;
        if(!user) {
            clearUser();
            navigate('/login');
        }
    },[user,loading,navigate,clearUser]);
};
   