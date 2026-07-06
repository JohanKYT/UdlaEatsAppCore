import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './User.module.css';

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('order-now');
    const navigate = useNavigate();

    const [userProfile, setUserProfile] = useState(() => {
        const storedUser = localStorage.getItem('udlaeats_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            return {
                id: parsedUser.userId || '',
                name: parsedUser.name || '',
                email: parsedUser.email || '',
                phone: parsedUser.phone || '',
                campus: parsedUser.campus || '',
                newPassword: ''
            };
        }
        return { id: '', name: '', email: '', phone: '', campus: '', newPassword: '' };
    });

    const [availableMenus, setAvailableMenus] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [myOrders, setMyOrders] = useState([]);

    // NUEVO ESTADO: Restaurante seleccionado
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const fetchAllMenus = async () => {
        try {
            const response = await api.get('/restaurants/menu/all');
            setAvailableMenus(response.data);
        } catch (error) {
            console.error("Error cargando la cartelera de menús", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await api.get(`/users/${userProfile.id}/notifications`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Error cargando notificaciones", error);
        }
    };

    const fetchMyOrders = async () => {
        try {
            const response = await api.get(`/orders/my-orders/${userProfile.id}`);
            setMyOrders(response.data);
        } catch (error) {
            console.error("Error cargando mis pedidos", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'order-now') fetchAllMenus();
        if (activeTab === 'my-orders' && userProfile.id) fetchMyOrders();
        if (userProfile.id) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [activeTab, userProfile.id]);

    // LÓGICA DE AGRUPACIÓN: Extraer restaurantes únicos del menú global
    const uniqueRestaurants = useMemo(() => {
        const map = new Map();
        availableMenus.forEach(item => {
            if (item.restaurant && !map.has(item.restaurant.id)) {
                map.set(item.restaurant.id, item.restaurant);
            }
        });
        return Array.from(map.values());
    }, [availableMenus]);

    // LÓGICA DE FILTRADO: Platillos del restaurante seleccionado
    const restaurantMenu = useMemo(() => {
        if (!selectedRestaurant) return [];
        return availableMenus.filter(item => item.restaurant?.id === selectedRestaurant.id);
    }, [availableMenus, selectedRestaurant]);

    const handleProfileChange = (e) => {
        setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${userProfile.id}/profile`, {
                name: userProfile.name,
                phone: userProfile.phone,
                campus: userProfile.campus,
                newPassword: userProfile.newPassword
            });
            alert("✅ ¡Tus datos han sido actualizados exitosamente!");
            const storedUser = JSON.parse(localStorage.getItem('udlaeats_user'));
            storedUser.name = userProfile.name;
            storedUser.phone = userProfile.phone;
            storedUser.campus = userProfile.campus;
            localStorage.setItem('udlaeats_user', JSON.stringify(storedUser));
        } catch (error) {
            alert("❌ Error al actualizar el perfil.");
        }
    };

    const handleOrder = async (item) => {
        try {
            await api.post('/orders/place', { userId: userProfile.id, menuItemId: item.id });
            alert(`✅ ¡Pedido confirmado! Pasa a retirarlo.`);
            fetchAllMenus();
        } catch (error) {
            alert("❌ Producto agotado o error al procesar.");
        }
    };

    const handleCancelOrder = async (orderId, itemName) => {
        const menuItem = availableMenus.find(m => m.name === itemName);
        if(!menuItem) {
            alert("Error: No se encontró el platillo en la base para devolver stock.");
            return;
        }

        try {
            await api.patch(`/orders/${orderId}/cancel?menuItemId=${menuItem.id}`);
            alert("✅ Pedido cancelado exitosamente dentro de los 5 minutos.");
            fetchMyOrders();
        } catch (error) {
            alert(error.response?.data || "❌ Error al cancelar. Quizá ya pasaron 5 minutos.");
        }
    };

    const handleAcceptNotification = async (notifId) => {
        try {
            await api.patch(`/users/notifications/${notifId}/convert`);
            alert("✅ ¡Sugerencia aceptada! Redirigiendo al menú para que hagas tu pedido.");
            fetchNotifications();
            setActiveTab('order-now');
            setSelectedRestaurant(null); // Resetea la vista para que elija el restaurante
        } catch (error) {
            console.error("Error al aceptar notificación", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('udlaeats_user');
        navigate('/login');
    };

    return (
        <main className={styles.userMain}>
            <nav className={styles.topNav}>
                <h1>UdlaEats Campus</h1>
                <section className={styles.navLinks}>
                    <button onClick={() => { setActiveTab('order-now'); setSelectedRestaurant(null); }} className={activeTab === 'order-now' ? styles.activeLink : styles.linkBtn}>Realizar Pedido</button>
                    <button onClick={() => setActiveTab('my-orders')} className={activeTab === 'my-orders' ? styles.activeLink : styles.linkBtn}>Mis Pedidos</button>
                    <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? styles.activeLink : styles.linkBtn}>Mi Perfil</button>
                    <button onClick={() => setActiveTab('notifications')} className={activeTab === 'notifications' ? styles.activeLink : styles.notificationBtn}>
                        🔔 <span className={styles.badge}>{notifications.length}</span>
                    </button>
                    <button onClick={handleLogout} className={styles.linkBtn} style={{ color: '#c0392b' }}>Cerrar Sesión</button>
                </section>
            </nav>

            <section className={styles.contentBody}>
                {activeTab === 'notifications' && (
                    <section>
                        <header className={styles.sectionHeader}>
                            <h3>Notificaciones Predictivas</h3>
                        </header>
                        <section className={styles.notificationList}>
                            {notifications.length === 0 ? <p>No tienes notificaciones nuevas.</p> : (
                                notifications.map(notif => (
                                    <article key={notif.id} className={styles.notifCard}>
                                        <p><strong>🤖 Asistente UdlaEats:</strong> {notif.message}</p>
                                        <footer style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
                                            <small>{new Date(notif.createdAt).toLocaleTimeString()}</small>
                                            <button onClick={() => handleAcceptNotification(notif.id)} className={styles.updateBtn} style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>
                                                ¡Lo quiero! (Aceptar)
                                            </button>
                                        </footer>
                                    </article>
                                ))
                            )}
                        </section>
                    </section>
                )}

                {activeTab === 'order-now' && (
                    <section>
                        {/* VISTA 1: LISTADO DE RESTAURANTES */}
                        {!selectedRestaurant ? (
                            <>
                                <header className={styles.sectionHeader}>
                                    <h3>Selecciona un Restaurante</h3>
                                    <p>Campus: {userProfile.campus || 'General'}</p>
                                </header>
                                <section className={styles.menuGrid}>
                                    {uniqueRestaurants.length === 0 ? <p>Cargando locales...</p> : (
                                        uniqueRestaurants.map(rest => (
                                            <article key={rest.id} className={styles.menuStockCard} style={{cursor: 'pointer', border: '2px solid transparent'}} onClick={() => setSelectedRestaurant(rest)} onMouseOver={(e) => e.currentTarget.style.borderColor = '#3498db'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                                                <figure className={styles.menuImageContainer} style={{height: '120px', backgroundColor: '#ecf0f1', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <span style={{fontSize: '3rem'}}>🏪</span>
                                                </figure>
                                                <section className={styles.menuDetails} style={{textAlign: 'center'}}>
                                                    <h4>{rest.user?.name || `Local ${rest.id}`}</h4>
                                                    <p className={styles.restaurantName}>📍 {rest.campusLocation}</p>
                                                    <p>Horario: {rest.openTime.substring(0,5)} - {rest.closeTime.substring(0,5)}</p>
                                                    <button className={styles.orderBtn} style={{marginTop: '1rem', width: '100%'}}>Ver Menú</button>
                                                </section>
                                            </article>
                                        ))
                                    )}
                                </section>
                            </>
                        ) : (
                            /* VISTA 2: MENÚ DEL RESTAURANTE SELECCIONADO */
                            <>
                                <header className={styles.sectionHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <section>
                                        <h3>Menú de {selectedRestaurant.user?.name}</h3>
                                        <p>📍 {selectedRestaurant.campusLocation}</p>
                                    </section>
                                    <button onClick={() => setSelectedRestaurant(null)} className={styles.cancelBtn} style={{padding: '0.5rem 1rem'}}>
                                        ⬅ Volver a Locales
                                    </button>
                                </header>
                                <section className={styles.menuGrid}>
                                    {restaurantMenu.length === 0 ? <p>Este local no tiene platillos disponibles hoy.</p> : (
                                        restaurantMenu.map(item => (
                                            <article key={item.id} className={styles.menuStockCard}>
                                                <figure className={styles.menuImageContainer}>
                                                    <img src={item.imageUrl} alt={item.name} className={styles.menuImage} loading="lazy" />
                                                    <span className={styles.categoryBadge}>{item.category}</span>
                                                </figure>
                                                <section className={styles.menuDetails}>
                                                    <h4>{item.name}</h4>
                                                    <p className={styles.menuDescription}>{item.description}</p>
                                                    <footer className={styles.orderFooter}>
                                                        <p className={styles.menuPrice}>${item.price.toFixed(2)}</p>
                                                        <menu style={{display: 'flex', gap: '10px', alignItems: 'center', padding: 0, margin: 0}}>
                                                            <small>Quedan: {item.stockQuantity}</small>
                                                            <button onClick={() => handleOrder(item)} className={styles.orderBtn}>Pedir Ahora</button>
                                                        </menu>
                                                    </footer>
                                                </section>
                                            </article>
                                        ))
                                    )}
                                </section>
                            </>
                        )}
                    </section>
                )}

                {activeTab === 'my-orders' && (
                    <section>
                        <header className={styles.sectionHeader}>
                            <h3>Historial de Órdenes</h3>
                        </header>
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                            {myOrders.length === 0 ? <p>Aún no has realizado ningún pedido.</p> : (
                                myOrders.map(order => (
                                    <article key={order.id} className={styles.orderCard} style={{borderLeft: order.status === 'PENDING' ? '5px solid #f1c40f' : order.status === 'PREPARING' ? '5px solid #3498db' : order.status === 'COMPLETED' ? '5px solid #27ae60' : '5px solid #e74c3c'}}>
                                        <header style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <h4>{order.itemName}</h4>
                                            <span style={{fontWeight: 'bold', color: order.status === 'PENDING' ? '#f39c12' : order.status === 'COMPLETED' ? '#27ae60' : '#e74c3c'}}>
                                                {order.status}
                                            </span>
                                        </header>
                                        <p style={{margin: '0.3rem 0', color: '#34495e'}}><strong>Local:</strong> {order.restaurant?.user?.name}</p>
                                        <p style={{margin: '0.3rem 0', fontSize: '0.9rem'}}>📅 {order.orderDate} a las 🕒 {order.orderTime.substring(0, 5)}</p>

                                        {order.status === 'PENDING' && (
                                            <footer style={{marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #ecf0f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <small style={{color: '#7f8c8d'}}>Tienes 5 min para cancelar.</small>
                                                <button onClick={() => handleCancelOrder(order.id, order.itemName)} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer'}}>
                                                    Cancelar Pedido
                                                </button>
                                            </footer>
                                        )}
                                    </article>
                                ))
                            )}
                        </section>
                    </section>
                )}

                {activeTab === 'profile' && (
                    <section>
                        <header className={styles.sectionHeader}>
                            <h3>Ajustes de Perfil</h3>
                        </header>
                        <form className={styles.profileForm} onSubmit={handleUpdateProfile}>
                            <label>Nombre Completo:
                                <input type="text" name="name" value={userProfile.name} onChange={handleProfileChange} required />
                            </label>
                            <label>Teléfono Celular:
                                <input type="tel" name="phone" value={userProfile.phone} onChange={handleProfileChange} required />
                            </label>
                            <label>Ubicación habitual (Campus):
                                <select name="campus" value={userProfile.campus} onChange={handleProfileChange} required style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                                    <option value="" disabled>Selecciona tu sede...</option>
                                    <option value="UDLA Park">UDLA Park</option>
                                    <option value="Granados">Granados</option>
                                </select>
                            </label>
                            <label>Nueva Contraseña:
                                <input type="password" name="newPassword" value={userProfile.newPassword} onChange={handleProfileChange} placeholder="Ingresa nueva contraseña si deseas cambiarla" />
                            </label>
                            <label className={styles.disabledLabel}>Correo Electrónico (Bloqueado por seguridad):
                                <input type="email" value={userProfile.email} disabled />
                            </label>
                            <button type="submit" className={styles.updateBtn}>Actualizar Datos</button>
                        </form>
                    </section>
                )}
            </section>
        </main>
    );
}