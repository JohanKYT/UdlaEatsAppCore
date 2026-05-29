import { useState } from 'react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <main className={styles.adminMain}>
            <nav className={styles.sidebarNav}>
                <header className={styles.navHeader}>
                    <h2>UdlaEats Admin</h2>
                </header>
                <button
                    className={activeTab === 'users' ? styles.activeBtn : styles.navBtn}
                    onClick={() => setActiveTab('users')}
                >
                    Gestión Usuarios
                </button>
                <button
                    className={activeTab === 'restaurants' ? styles.activeBtn : styles.navBtn}
                    onClick={() => setActiveTab('restaurants')}
                >
                    Gestión Restaurantes
                </button>
                <button
                    className={activeTab === 'notifications' ? styles.activeBtn : styles.navBtn}
                    onClick={() => setActiveTab('notifications')}
                >
                    Solicitudes Nuevas
                </button>
                <button
                    className={activeTab === 'profile' ? styles.activeBtn : styles.navBtn}
                    onClick={() => setActiveTab('profile')}
                >
                    Mi Perfil Admin
                </button>
            </nav>

            <section className={styles.contentSection}>
                {activeTab === 'users' && (
                    <section>
                        <h3>Usuarios del Sistema</h3>
                        <p>Aquí se listan los estudiantes y personal. El admin puede modificar correos, contraseñas y penalizaciones.</p>
                    </section>
                )}

                {activeTab === 'restaurants' && (
                    <section>
                        <h3>Restaurantes Registrados</h3>
                        <p>Control total de locales dentro de los campus de la UDLA.</p>
                    </section>
                )}

                {activeTab === 'notifications' && (
                    <section>
                        <h3>Solicitudes de Verificación de Restaurantes</h3>
                        <article className={styles.requestCard}>
                            <h4>KFC - Campus Granados</h4>
                            <p>Contacto: 0999999999 | Correo: kfc.granados@udla.edu.ec</p>
                            <form className={styles.inlineForm}>
                                <button type="button" className={styles.approveBtn}>Aprobar Cuenta</button>
                                <button type="button" className={styles.rejectBtn}>Rechazar</button>
                            </form>
                        </article>
                    </section>
                )}

                {activeTab === 'profile' && (
                    <section>
                        <h3>Editar Perfil de Administrador</h3>
                        <form className={styles.adminForm}>
                            <label>
                                Correo Electrónico (Admin puede cambiar el suyo):
                                <input type="email" defaultValue="admin.core@udla.edu.ec" required />
                            </label>
                            <label>
                                Nueva Contraseña:
                                <input type="password" placeholder="••••••••" required />
                            </label>
                            <button type="submit" className={styles.saveBtn}>Guardar Cambios</button>
                        </form>
                    </section>
                )}
            </section>
        </main>
    );
}