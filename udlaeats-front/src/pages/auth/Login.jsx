import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './Auth.module.css';

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', credentials);
            const userData = response.data;

            localStorage.setItem('udlaeats_user', JSON.stringify(userData));

            alert("✅ " + userData.message + ", " + userData.name);

            const userRole = userData.role;

            if (userRole === "ADMIN") {
                navigate('/admin');
            } else if (userRole === "RESTAURANT") {
                navigate('/restaurant');
            } else {
                navigate('/user');
            }

        } catch (error) {
            if (error.response) {
                alert("❌ " + error.response.data);
            } else {
                alert("❌ Error al conectar con el servidor.");
            }
        }
    };

    return (
        <main className={styles.authMain}>
            <section className={styles.authSection}>
                <header className={styles.authHeader}>
                    <h1>Ingreso a UdlaEats</h1>
                </header>

                <form className={styles.authForm} onSubmit={handleSubmit}>
                    <fieldset className={styles.authFieldset}>
                        <label className={styles.authLabel}>
                            Correo Institucional:
                            <input
                                type="email"
                                name="email"
                                className={styles.authInput}
                                placeholder="tu.nombre@udla.edu.ec"
                                pattern="^[^@\s]+@udla\.edu\.ec$"
                                title="Debe ser un correo terminado en @udla.edu.ec"
                                required
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </label>

                        <label className={styles.authLabel}>
                            Contraseña:
                            <input
                                type="password"
                                name="password"
                                className={styles.authInput}
                                placeholder="••••••••"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </label>
                    </fieldset>

                    <button type="submit" className={styles.authButton}>
                        Iniciar Sesión
                    </button>
                </form>

                <footer className={styles.authFooter}>
                    <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
                </footer>
            </section>
        </main>
    );
}