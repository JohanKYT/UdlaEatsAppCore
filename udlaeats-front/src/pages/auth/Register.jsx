import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        roleId: '' //determina que rol tiene
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Enviando registro al back...", formData);
        // Conectamos con el AuthController de Spring Boot
    };

    return (
        <main className={styles.authMain}>
            <section className={styles.authSection}>
                <header className={styles.authHeader}>
                    <h1>Crear Cuenta UdlaEats</h1>
                </header>

                <form className={styles.authForm} onSubmit={handleSubmit}>

                    <fieldset className={styles.authFieldset}>
                        <legend className={styles.authLegend}>Datos Personales</legend>
                        <label className={styles.authLabel}>
                            Nombre Completo:
                            <input
                                type="text"
                                name="name"
                                className={styles.authInput}
                                placeholder="Ej. Kevin Maquis"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </label>

                        <label className={styles.authLabel}>
                            Correo Institucional (@udla.edu.ec):
                            <input
                                type="email"
                                name="email"
                                className={styles.authInput}
                                placeholder="kevin.maquis@udla.edu.ec"
                                pattern="^[\w-\.]+@udla\.edu\.ec$"
                                title="Debe ser un correo institucional válido"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </label>
                    </fieldset>

                    <fieldset className={styles.authFieldset}>
                        <legend className={styles.authLegend}>Seguridad y Rol</legend>
                        <label className={styles.authLabel}>
                            Contraseña:
                            <input
                                type="password"
                                name="password"
                                className={styles.authInput}
                                placeholder="Mínimo 8 caracteres"
                                minLength="8"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </label>

                        <label className={styles.authLabel}>
                            Tipo de Cuenta:
                            <select
                                name="roleId"
                                className={styles.authSelect}
                                required
                                value={formData.roleId}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Selecciona tu rol...</option>
                                <option value="2">Usuario (Estudiante/Personal)</option>
                                <option value="3">Restaurante</option>
                            </select>
                        </label>
                    </fieldset>

                    <button type="submit" className={styles.authButton}>
                        Registrarse
                    </button>
                </form>

                <footer className={styles.authFooter}>
                    <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
                </footer>
            </section>
        </main>
    );
}