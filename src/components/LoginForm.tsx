import { useState } from 'react';
import styles from './LoginForm.module.css';
import type { LoginRequest } from '../services/api';

type LoginFormProps = {
    login: (credentials: LoginRequest) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
};

export const LoginForm = ({ login, isLoading, error }: LoginFormProps) => {
    const [email, setEmail] = useState('admin@azenta.com');
    const [password, setPassword] = useState('password');
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        const success = await login({ email, password });
        if (!success) setLocalError('Login failed. Please try again.');
    };

    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <p className={styles.subtitle}>Sign in to view orders</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className={styles.input}
                    autoComplete="username"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className={styles.input}
                    autoComplete="current-password"
                />

                {(error || localError) && (
                    <div className={styles.error}>{error || localError}</div>
                )}

                <button type="submit" disabled={isLoading} className={styles.button}>
                    {isLoading ? 'Signing in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};
