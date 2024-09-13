import { User } from "firebase/auth";
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    children: React.ReactNode;
    user: User | null; // or a more specific type, e.g. { id: string, name: string }
  }

export const ProtectedRoute = ({ children, user }: ProtectedRouteProps) => {
    return user && localStorage.getItem('isLoggedIn') === 'true' ? children : <Navigate to="/signin" replace/>
}