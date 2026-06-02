import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './Auth.module.css';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roleId: '', //determina que rol tiene
        name: '',
        email: '',
        password: '',
        phone: '',
        campus: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', formData);

            alert("✅ " + response.data);
            navigate('/login');

        } catch (error) {
            if (error.response) {
                alert("❌ Error: " + error.response.data);
            } else {
                alert("❌ Error de conexión. Verifica que Spring Boot esté encendido.");
            }
        }
    };

    return (
        <main className={styles.authMain}>
            <section className={styles.authSection}>
                <header className={styles.authHeader}>
                    <h1>Crear Cuenta UdlaEats</h1>
                </header>

                <form className={styles.authForm} onSubmit={handleSubmit}>

                    {/* 1. SELECCIÓN DE ROL PRIMERO */}
                    <fieldset className={styles.authFieldset}>
                        <label className={styles.authLabel}>
                            ¿Qué tipo de cuenta deseas crear?
                            <select name="roleId" className={styles.authSelect} required value={formData.roleId} onChange={handleChange}>
                                <option value="" disabled>Selecciona tu rol...</option>
                                <option value="2">Estudiante / Personal</option>
                                <option value="3">Restaurante / Local Comercial</option>
                            </select>
                        </label>
                    </fieldset>

                    {formData.roleId && (
                        <>
                        <fieldset className={styles.authFieldset}>
                            <legend className={styles.authLegend}>Datos Generales</legend>
                            <label className={styles.authLabel}>
                                {formData.roleId === '3' ? 'Nombre del Restaurante:' : 'Nombre Completo:'}
                                <input type="text" name="name" className={styles.authInput} placeholder={formData.roleId === '3' ? "Ej. KFC Granados" : "Ej. Kevin Johan Maquis Calle"} required value={formData.name} onChange={handleChange} />
                            </label>

                            <label className={styles.authLabel}>
                                Correo Institucional (@udla.edu.ec):
                                <input type="email" name="email" className={styles.authInput} placeholder="usuario@udla.edu.ec" pattern="^[^@\s]+@udla\.edu\.ec$" title="Debe ser un correo institucional válido" required value={formData.email} onChange={handleChange} />
                            </label>

                            <label className={styles.authLabel}>
                                Teléfono Celular:
                                <input type="tel" name="phone" className={styles.authInput} placeholder="0987654321" required value={formData.phone} onChange={handleChange} />
                            </label>

                            <label className={styles.authLabel}>
                                Sede Principal:
                                <select name="campus" className={styles.authSelect} required value={formData.campus} onChange={handleChange}>
                                    <option value="" disabled>Selecciona tu sede...</option>
                                    <option value="UDLA Park">UDLA Park</option>
                                    <option value="Granados">Granados</option>
                                    <option value="Queri">Queri</option>
                                </select>
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

                    </fieldset>

                    <button type="submit" className={styles.authButton}>
                        Registrarse
                    </button>
                        </>
                        )}
                </form>

                <footer className={styles.authFooter}>
                    <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
                </footer>
            </section>
        </main>
    );
}