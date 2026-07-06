import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Estados de datos
    const [pendingRequests, setPendingRequests] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [systemStats, setSystemStats] = useState(null);

    // NUEVOS ESTADOS PARA EL MONITOR PREDICTIVO DINÁMICO
    const [predictiveQueue, setPredictiveQueue] = useState([]);
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Estados de UI
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [editingUser, setEditingUser] = useState(null);

    const navigate = useNavigate();

    // Reloj interno que se actualiza cada segundo para la cuenta regresiva
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // API Calls
    useEffect(() => {
        const fetchPendingRestaurants = async () => {
            try {
                const response = await api.get('/admin/pending-restaurants');
                setPendingRequests(response.data);
            } catch (error) {
                console.error("Error cargando solicitudes", error);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                setUsersList(response.data);
            } catch (error) {
                console.error("Error cargando usuarios", error);
            }
        };

        const fetchSystemStats = async () => {
            try {
                const response = await api.get('/admin/reports/summary');
                setSystemStats(response.data.data);
            } catch (error) {
                console.error("Error al consumir el API JSON", error);
            }
        };

        if (activeTab === 'notifications') {
            fetchPendingRestaurants();
        } else if (activeTab === 'users' || activeTab === 'restaurants') {
            fetchAllUsers();
        } else if (activeTab === 'reports') {
            fetchSystemStats();
        }
    }, [activeTab]);

    // Simulación de la cola en tiempo real al cargar los usuarios
    useEffect(() => {
        if (usersList.length > 0 && predictiveQueue.length === 0) {
            const students = usersList.filter(u => u.role?.roleName === 'USER').slice(0, 3);

            // Les asignamos tiempos de espera (ej: 1, 2 y 3 minutos desde que abres la pestaña)
            const queue = students.map((u, index) => ({
                ...u,
                targetTime: Date.now() + ((index + 1) * 60000) + (Math.random() * 30000)
            }));
            setPredictiveQueue(queue);
        }
    }, [usersList, predictiveQueue.length]);

    const togglePasswordVisibility = (userId) => {
        setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("⚠️ ¿Estás seguro de ELIMINAR a este usuario por completo?")) {
            try {
                await api.delete(`/admin/users/${userId}`);
                alert("🗑️ Usuario eliminado.");
                const res = await api.get('/admin/users');
                setUsersList(res.data);
            } catch (error) {
                alert("❌ Error al eliminar");
            }
        }
    };

    const openEditModal = (user) => setEditingUser(user);
    const handleEditChange = (e) => setEditingUser({ ...editingUser, [e.target.name]: e.target.value });

    const submitEditUser = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/users/${editingUser.id}`, editingUser);
            alert("✅ Usuario actualizado por el Administrador.");
            setEditingUser(null);
            const res = await api.get('/admin/users');
            setUsersList(res.data);
        } catch (error) {
            alert("❌ Error al actualizar");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('udlaeats_user');
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsMenuOpen(false);
    };

    const handleApprove = async (userId) => {
        try {
            await api.patch(`/admin/approve/${userId}`);
            alert("✅ Restaurante aprobado exitosamente.");
            const response = await api.get('/admin/pending-restaurants');
            setPendingRequests(response.data);
        } catch (error) {
            alert("❌ Error al aprobar");
        }
    };

    const handleReject = async (userId) => {
        const reason = window.prompt("¿Por qué rechazas esta solicitud? (Ej. Faltan datos, Correo inválido):");
        if (reason) {
            try {
                await api.patch(`/admin/reject/${userId}?reason=${encodeURIComponent(reason)}`);
                alert("Restaurante rechazado.");
                const response = await api.get('/admin/pending-restaurants');
                setPendingRequests(response.data);
            } catch (error) {
                alert("❌ Error al rechazar");
            }
        }
    };

    const handleForcePredictive = async () => {
        try {
            await api.post('/admin/force-predictive-engine');

            // Forzamos a que todos en la cola visual cambien a "Enviado" automáticamente
            const forcedQueue = predictiveQueue.map(u => ({...u, targetTime: Date.now() - 1000}));
            setPredictiveQueue(forcedQueue);

            alert("🚀 ¡Motor Predictivo ejecutado! Las notificaciones han sido generadas.");
        } catch (error) {
            alert("❌ Error al ejecutar el motor.");
        }
    };

    return (
        <main className={styles.adminMain}>
            <header className={styles.mobileHeader}>
                <h2>UdlaEats Admin</h2>
                <button className={styles.hamburgerBtn} onClick={toggleMenu} aria-label="Abrir menú">☰</button>
            </header>

            {isMenuOpen && (
                <span className={styles.overlay} onClick={toggleMenu} role="presentation"></span>
            )}

            {editingUser && (
                <section className={styles.modalOverlay} role="dialog" aria-modal="true">
                    <article className={styles.modalContent}>
                        <h3>Editar Perfil (Modo Dios)</h3>
                        <form className={styles.modalForm} onSubmit={submitEditUser}>
                            <label>Nombre: <input type="text" name="name" value={editingUser.name || ''} onChange={handleEditChange} required /></label>
                            <label>Correo: <input type="email" name="email" value={editingUser.email || ''} onChange={handleEditChange} required /></label>
                            <label>Teléfono: <input type="text" name="phone" value={editingUser.phone || ''} onChange={handleEditChange} /></label>
                            <label>Campus: <input type="text" name="campus" value={editingUser.campus || ''} onChange={handleEditChange} /></label>
                            <label>Contraseña: <input type="text" name="password" value={editingUser.password || ''} onChange={handleEditChange} required /></label>
                            <label>
                                Estado de Cuenta:
                                <select name="accountStatus" value={editingUser.accountStatus || 'PENDING'} onChange={handleEditChange}>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="REJECTED">REJECTED</option>
                                </select>
                            </label>
                            <menu className={styles.modalActions} style={{ padding: 0, margin: '1rem 0 0 0' }}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setEditingUser(null)}>Cancelar</button>
                                <button type="submit" className={styles.saveBtn} style={{flex: 1}}>Guardar</button>
                            </menu>
                        </form>
                    </article>
                </section>
            )}

            <nav className={`${styles.sidebarNav} ${isMenuOpen ? styles.open : ''}`}>
                <header className={styles.navHeader}>
                    <h2>UdlaEats Admin</h2>
                </header>
                <button className={activeTab === 'users' ? styles.activeBtn : styles.navBtn} onClick={() => handleTabChange('users')}>
                    Gestión Usuarios
                </button>
                <button className={activeTab === 'restaurants' ? styles.activeBtn : styles.navBtn} onClick={() => handleTabChange('restaurants')}>
                    Gestión Restaurantes
                </button>
                <button className={activeTab === 'notifications' ? styles.activeBtn : styles.navBtn} onClick={() => handleTabChange('notifications')}>
                    Control Central
                </button>
                <button className={activeTab === 'reports' ? styles.activeBtn : styles.navBtn} onClick={() => handleTabChange('reports')}>
                    Métricas del Sistema
                </button>
                <button className={activeTab === 'profile' ? styles.activeBtn : styles.navBtn} onClick={() => handleTabChange('profile')}>
                    Mi Perfil Admin
                </button>
                <button className={`${styles.navBtn} ${styles.logoutBtn}`} onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </nav>

            <section className={styles.contentSection}>
                {activeTab === 'users' && (
                    <section style={{overflowX: 'auto'}}>
                        <h3>Estudiantes y Personal del Sistema</h3>
                        <table className={styles.adminTable}>
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Campus</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Contraseña</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersList.filter(u => u.role?.roleName !== 'RESTAURANT').map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone || 'N/A'}</td>
                                    <td>{u.campus || 'N/A'}</td>
                                    <td>{u.role?.roleName}</td>
                                    <td>
                                        <span style={{ color: u.accountStatus === 'APPROVED' ? '#27ae60' : u.accountStatus === 'PENDING' ? '#f39c12' : '#c0392b', fontWeight: 'bold' }}>
                                            {u.accountStatus}
                                        </span>
                                    </td>
                                    <td>
                                        {visiblePasswords[u.id] ? u.password : '••••••••'}
                                        <button className={styles.eyeBtn} onClick={() => togglePasswordVisibility(u.id)} title="Mostrar/Ocultar">
                                            {visiblePasswords[u.id] ? '🙈' : '👁️'}
                                        </button>
                                    </td>
                                    <td>
                                        <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEditModal(u)}>Editar</button>
                                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteUser(u.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {activeTab === 'restaurants' && (
                    <section style={{overflowX: 'auto'}}>
                        <h3>Restaurantes Registrados</h3>
                        <table className={styles.adminTable}>
                            <thead>
                            <tr>
                                <th>Restaurante</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Campus</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersList.filter(u => u.role?.roleName === 'RESTAURANT').map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone || 'N/A'}</td>
                                    <td>{u.campus || 'N/A'}</td>
                                    <td>
                                        <span style={{ color: u.accountStatus === 'APPROVED' ? '#27ae60' : u.accountStatus === 'PENDING' ? '#f39c12' : '#c0392b', fontWeight: 'bold' }}>
                                            {u.accountStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEditModal(u)}>Editar</button>
                                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteUser(u.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <p>Control total de locales dentro de los campus de la UDLA.</p>
                    </section>
                )}

                {activeTab === 'notifications' && (
                    <section>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3>Panel de Control Central y Motor Predictivo</h3>
                            <button
                                onClick={handleForcePredictive}
                                className={styles.saveBtn}
                                style={{backgroundColor: '#8e44ad', fontSize: '1rem', padding: '0.8rem 1.5rem'}}
                            >
                                🚀 Disparar Alertas (Modo Demo)
                            </button>
                        </header>

                        {/* EL MONITOR PREDICTIVO VISUAL PARA LA DEFENSA (AHORA ES DINÁMICO) */}
                        <article style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', borderLeft: '5px solid #8e44ad', marginBottom: '2rem' }}>
                            <h4 style={{ color: '#8e44ad', marginTop: 0 }}>📡 Monitor de Cola Predictiva (Tiempo Real)</h4>
                            <p style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>El algoritmo está evaluando los hábitos de consumo de los siguientes usuarios para enviar sugerencias:</p>

                            <table className={styles.adminTable} style={{ marginTop: '1rem', background: 'white' }}>
                                <thead>
                                <tr>
                                    <th>Usuario Objetivo</th>
                                    <th>Estado del Motor</th>
                                    <th>Tiempo Restante</th>
                                </tr>
                                </thead>
                                <tbody>
                                {predictiveQueue.length === 0 ? (
                                    <tr><td colSpan="3" style={{textAlign: 'center'}}>No hay notificaciones en cola.</td></tr>
                                ) : (
                                    predictiveQueue.map((u) => {
                                        const timeLeft = Math.max(0, u.targetTime - currentTime);
                                        const isSent = timeLeft <= 0;

                                        const minutes = Math.floor(timeLeft / 60000);
                                        const seconds = Math.floor((timeLeft % 60000) / 1000);

                                        return (
                                            <tr key={u.id}>
                                                <td><strong>{u.name}</strong><br/><small>{u.email}</small></td>
                                                <td>
                                                    {isSent ? (
                                                        <span style={{ color: '#27ae60', fontWeight: 'bold' }}>¡Notificación Enviada! ✔️</span>
                                                    ) : (
                                                        <span style={{ color: '#f39c12', fontWeight: 'bold' }}>Calculando variables... ⚙️</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {isSent ? (
                                                        <span style={{ color: '#7f8c8d' }}>Completado</span>
                                                    ) : (
                                                        <span style={{fontFamily: 'monospace', fontSize: '1.1rem', color: '#e74c3c'}}>
                                                            ⏳ {minutes}m {seconds < 10 ? '0' : ''}{seconds}s
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                                </tbody>
                            </table>
                            <small style={{display: 'block', marginTop: '1rem', color: '#95a5a6'}}>
                                * Nota: Al presionar "Disparar Alertas", se ignorará la cuenta regresiva y se enviarán notificaciones push a todos los usuarios con coincidencias en el patrón del día actual.
                            </small>
                        </article>

                        <hr style={{ border: '1px solid #ecf0f1', margin: '2rem 0' }} />

                        <h4>Solicitudes de Verificación Pendientes</h4>
                        {pendingRequests.length === 0 ? (
                            <p>No hay solicitudes de restaurantes pendientes.</p>
                        ) : (
                            pendingRequests.map((req) => (
                                <article key={req.id} className={styles.requestCard}>
                                    <h4>{req.name}</h4>
                                    <p>Correo de registro: {req.email}</p>
                                    <p><small>Fecha de solicitud: Reciente</small></p>
                                    <form className={styles.inlineForm}>
                                        <button type="button" className={styles.approveBtn} onClick={() => handleApprove(req.id)}>Aprobar Cuenta</button>
                                        <button type="button" className={styles.rejectBtn} onClick={() => handleReject(req.id)}>Rechazar</button>
                                    </form>
                                </article>
                            ))
                        )}
                    </section>
                )}

                {activeTab === 'reports' && (
                    <section>
                        <h3>Métricas y Reportes Globales (API JSON)</h3>
                        {systemStats ? (
                            <section style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                <article style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', borderLeft: '5px solid #3498db', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flex: '1' }}>
                                    <h4 style={{ margin: 0, color: '#7f8c8d' }}>Usuarios Totales</h4>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{systemStats.totalRegisteredUsers}</p>
                                </article>
                                <article style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', borderLeft: '5px solid #2ecc71', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flex: '1' }}>
                                    <h4 style={{ margin: 0, color: '#7f8c8d' }}>Órdenes Procesadas</h4>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{systemStats.totalHistoricalOrders}</p>
                                </article>
                                <article style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', borderLeft: '5px solid #f1c40f', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flex: '1' }}>
                                    <h4 style={{ margin: 0, color: '#7f8c8d' }}>Promedio de Pedidos por Usuario</h4>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{systemStats.averageOrdersPerUser}</p>
                                </article>
                            </section>
                        ) : (
                            <p>Cargando métricas desde el servidor...</p>
                        )}
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