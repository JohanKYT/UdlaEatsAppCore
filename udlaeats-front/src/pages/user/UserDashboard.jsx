import { useState } from 'react';
import styles from './User.module.css';

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('order-now');

    return (
        <main className={styles.userMain}>
            <nav className={styles.topNav}>
                <h1>UdlaEats Campus</h1>
                <section className={styles.navLinks}>
                    <button onClick={() => setActiveTab('order-now')} className={activeTab === 'order-now' ? styles.activeLink : styles.linkBtn}>Realizar Pedido</button>
                    <button onClick={() => setActiveTab('my-orders')} className={activeTab === 'my-orders' ? styles.activeLink : styles.linkBtn}>Mis Pedidos</button>
                    <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? styles.activeLink : styles.linkBtn}>Mi Perfil</button>
                </section>
            </nav>

            <section className={styles.contentBody}>
                {activeTab === 'order-now' && (
                    <section>
                        <h3>Menús disponibles en el Campus</h3>
                        <p>Los menús cambian sincrónicamente según la disponibilidad del restaurante.</p>
                    </section>
                )}

                {activeTab === 'my-orders' && (
                    <section>
                        <h3>Historial de Órdenes y Estatus</h3>
                        <article className={styles.orderCard}>
                            <header>
                                <h4>Pedido #1042 - Café Mochaccino</h4>
                            </header>
                            <p>Estado: Listo para retirar | Pago pendiente en caja: $2.50</p>
                            <footer>
                                <small>⚠️ Recuerda retirar a tiempo. El incumplimiento genera saldo negativo.</small>
                            </footer>
                        </article>
                    </section>
                )}

                {activeTab === 'profile' && (
                    <section>
                        <h3>Ajustes de Perfil</h3>
                        <form className={styles.profileForm}>
                            <label>
                                Nombre Completo:
                                <input type="text" defaultValue="Kevin Maquis" required />
                            </label>
                            <label>
                                Teléfono Celular:
                                <input type="tel" defaultValue="0987654321" required />
                            </label>
                            <label>
                                Ubicación habitual (Campus):
                                <input type="text" defaultValue="UDLA Granados" required />
                            </label>
                            <label>
                                Nueva Contraseña:
                                <input type="password" placeholder="Ingresa nueva contraseña si deseas cambiarla" />
                            </label>
                            <label className={styles.disabledLabel}>
                                Correo Electrónico (Bloqueado por seguridad - Solo Admin puede editarlo):
                                <input type="email" value="kevin.maquis@udla.edu.ec" disabled />
                            </label>
                            <button type="submit" className={styles.updateBtn}>Actualizar Datos</button>
                        </form>
                    </section>
                )}
            </section>
        </main>
    );
}