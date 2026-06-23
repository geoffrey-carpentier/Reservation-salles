// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/authCreate.js';

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
}
export default useAuth;



//?  UTILISATION
//?  Dans n'importe quel composant :
/*
import { useAuth } from '../hooks/useAuth.js';

function MonComposant() {
 const { user, isAuthenticated, logout } = useAuth();

 return <p>Bonjour {user?.firstname} !</p>;
}
*/