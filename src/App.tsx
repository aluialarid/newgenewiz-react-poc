import { useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import {LoginForm} from './components/LoginForm';
import { OrdersList } from './components/OrdersList';
import { useAuth } from './hooks/useAuth';

function App() {
    const { user, isAuthenticated, logout, login, isLoading, error } = useAuth();
    const [showEnriched, setShowEnriched] = useState(false);

    return (
        <div>
            <Header />

            <div className="card">
                {isAuthenticated && user ? (
                    <>
                        <div className="dashboard-header">
                            <h2>Dashboard</h2>
                            <p className="auth-status">✓ Authenticated via Session Cookie</p>
                            <p className="user-email">User: {user.email}</p>
                        </div>

                        <div className="controls">
                            <button
                                onClick={() => setShowEnriched(!showEnriched)}
                                className="btn btn-primary"
                            >
                                {showEnriched ? 'Show Basic Orders' : 'Show Orders with Pricing'}
                            </button>

                            <button onClick={logout} className="btn btn-danger">
                                Log Out
                            </button>
                        </div>

                        <OrdersList enriched={showEnriched} />
                    </>
                ) : (
                    <LoginForm login={login} isLoading={isLoading} error={error} />
                )}
            </div>
        </div>
    );
}

export default App;

