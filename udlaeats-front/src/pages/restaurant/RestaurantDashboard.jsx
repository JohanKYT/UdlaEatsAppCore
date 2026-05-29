import { useState } from 'react';
import styles from './Restaurant.module.css';

export default function RestaurantDashboard() {
    const [activeTab, setActiveTab] = useState('menu-management');

    return (
        <main className={styles.restMain}>
            <nav className={styles.sideMenu}>
                <header>
                    <h3>Panel Restaurante</h3>
                </header>
                <button onClick={() => setActiveTab('menu-management')} className={activeTab === 'menu-management' ? styles.activeTabBtn : styles.tabBtn}>Gestión de Menú</button>
                <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? styles.activeTabBtn : styles.tabBtn}>Configurar Local</button>
            </nav>

            <section className={styles.workspace}>
                {activeTab === 'menu-management' && (
                    <section>
                        <h3>Mis Menús y Control de Stock</h3>
                        <p>Los cambios en el switch de disponibilidad y cantidad de porciones se reflejan en tiempo real para los alumnos.</p>

                        <form className={styles.inlineAddMenuForm}>
                            <input type="text" placeholder="Nombre del Platillo (ej. Hamburguesa Udla)" required />
                            <input type="number" step="0.01" placeholder="Precio" required />
                            <input type="number" placeholder="Stock Inicial" required />
                            <button type="submit">Agregar al Menú</button>
                        </form>

                        <article className={styles.menuStockCard}>
                            <h4>Almuerzo Ejecutivo Ejecutivo</h4>
                            <p>Precio: $3.50 | Stock disponible: 15 unidades</p>
                            <label className={styles.switchLabel}>
                                <input type="checkbox" defaultChecked /> Disponible en app
                            </label>
                        </article>
                    </section>
                )}

                {activeTab === 'profile' && (
                    <section>
                        <h3>Datos Operativos del Establecimiento</h3>
                        <form className={styles.restForm}>
                            <label>
                                Nombre del Establecimiento Comercial:
                                <input type="text" defaultValue="KFC Granados" required />
                            </label>
                            <label>
                                Ubicación Física dentro del Campus:
                                <input type="text" defaultValue="Bloque Psi, Planta Baja junto a las canchas" required />
                            </label>
                            <label>
                                Horario de Atención de apertura y cierre:
                                <input type="text" defaultValue="07:00 AM - 19:30 PM" required />
                            </label>
                            <label>
                                Números Telefónicos de Contacto Directo:
                                <input type="tel" defaultValue="022234567" required />
                            </label>
                            <label className={styles.alertLabel}>
                                Correo de Acceso (No editable - Solicitar cambio al Administrador General):
                                <input type="email" value="kfc.granados@udla.edu.ec" disabled />
                            </label>
                            <button type="submit" className={styles.saveRestBtn}>Guardar Horarios y Datos</button>
                        </form>
                    </section>
                )}
            </section>
        </main>
    );
}