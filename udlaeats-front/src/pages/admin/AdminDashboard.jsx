import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();

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

        if (activeTab === 'notifications') {
            fetchPendingRestaurants();
        }
        else if (activeTab === 'users' || activeTab === 'restaurants') {
            fetchAllUsers();
        }
    }, [activeTab]);

    const togglePasswordVisibility = (userId) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
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

    const openEditModal = (user) => {
        setEditingUser(user);
    };

    const handleEditChange = (e) => {
        setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    };

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
            alert("🚀 ¡Motor Predictivo ejecutado! Las notificaciones han sido generadas.");
        } catch (error) {
            alert("❌ Error al ejecutar el motor.");
        }
    };

    return (
        <main className={styles.adminMain}>
            <header className={styles.mobileHeader}>
                <h2>UdlaEats Admin</h2>
                <button className={styles.hamburgerBtn} onClick={toggleMenu} aria-label="Abrir menú">
                    ☰
                </button>
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
                <button
                    className={activeTab === 'users' ? styles.activeBtn : styles.navBtn}
                    onClick={() => handleTabChange('users')}
                >
                    Gestión Usuarios
                </button>
                <button
                    className={activeTab === 'restaurants' ? styles.activeBtn : styles.navBtn}
                    onClick={() => handleTabChange('restaurants')}
                >
                    Gestión Restaurantes
                </button>
                <button
                    className={activeTab === 'notifications' ? styles.activeBtn : styles.navBtn}
                    onClick={() => handleTabChange('notifications')}
                >
                    Control Central
                </button>
                <button
                    className={activeTab === 'profile' ? styles.activeBtn : styles.navBtn}
                    onClick={() => handleTabChange('profile')}
                >
                    Mi Perfil Admin
                </button>
                <button
                    className={`${styles.navBtn} ${styles.logoutBtn}`}
                    onClick={handleLogout}
                >
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
                                            <span style={{ color: u.accountStatus === 'APPROVED' ? '#27ae60' : '#c0392b', fontWeight: 'bold' }}>
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
                    </section>
                )}

                {activeTab === 'notifications' && (
                    <section>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3>Panel de Control Central</h3>
                            {/* BOTÓN MODO PRESENTACIÓN */}
                            <button
                                onClick={handleForcePredictive}
                                className={styles.saveBtn}
                                style={{backgroundColor: '#8e44ad', fontSize: '1rem', padding: '0.8rem 1.5rem'}}
                            >
                                🚀 Forzar Motor Predictivo (Modo Demo)
                            </button>
                        </header>

                        <h4>Solicitudes de Verificación Pendientes</h4>
                        {pendingRequests.length === 0 ? (
                            <p>No hay solicitudes de restaurantes pendientes.</p>
                        ) : (
                            pendingRequests.map((req) => (
                                <article key={req.id} className={styles.requestCard}>
                                    <h4>{req.name}</h4>
                                    <p>Correo de registro: {req.email}</p>
                                    <form className={styles.inlineForm}>
                                        <button type="button" className={styles.approveBtn} onClick={() => handleApprove(req.id)}>Aprobar Cuenta</button>
                                        <button type="button" className={styles.rejectBtn} onClick={() => handleReject(req.id)}>Rechazar</button>
                                    </form>
                                </article>
                            ))
                        )}
                    </section>
                )}

                {activeTab === 'profile' && (
                    <section>
                        <h3>Editar Perfil de Administrador</h3>
                        <form className={styles.adminForm}>
                            <label>
                                Correo Electrónico:
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