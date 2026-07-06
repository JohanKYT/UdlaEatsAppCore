import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './Restaurant.module.css';

export default function RestaurantDashboard() {
    const [activeTab, setActiveTab] = useState('orders-queue');
    const navigate = useNavigate();

    const [restProfile, setRestProfile] = useState(() => {
        const storedUser = localStorage.getItem('udlaeats_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            return {
                id: parsedUser.userId || '',
                name: parsedUser.name || '',
                email: parsedUser.email || '',
                phone: parsedUser.phone || '',
                campus: parsedUser.campus || ''
            };
        }
        return { id: '', name: '', email: '', phone: '', campus: '' };
    });

    const [menuItems, setMenuItems] = useState([]);
    const [orderQueue, setOrderQueue] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: '',
        imageUrl: ''
    });

    const fetchMenu = async () => {
        try {
            const response = await api.get(`/restaurants/${restProfile.id}/menu`);
            setMenuItems(response.data);
        } catch (error) {
            console.error("Error al cargar el menú", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get(`/orders/restaurant/${restProfile.id}/queue`);
            setOrderQueue(response.data);
        } catch (error) {
            console.error("Error al cargar la cola de pedidos", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'menu-management' && restProfile.id) fetchMenu();
        if (activeTab === 'orders-queue' && restProfile.id) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 10000);
            return () => clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, restProfile.id]);

    const handleUpdateOrderStatus = async (orderId, status) => {
        const confirmMsg = status === 'NO_SHOW'
            ? "⚠️ ¿Seguro que el alumno no llegó? Esto le sumará una PENALIZACIÓN."
            : "¿Marcar como entregado?";

        if(window.confirm(confirmMsg)) {
            try {
                await api.patch(`/orders/${orderId}/status?newStatus=${status}`);
                fetchOrders();
            } catch (error) {
                alert("❌ Error al actualizar pedido.");
            }
        }
    };

    const handleNewItemChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleAddMenu = async (e) => {
        e.preventDefault();
        try {
            await api.post('/restaurants/menu', {
                ...newItem,
                userId: restProfile.id,
                price: parseFloat(newItem.price),
                stockQuantity: parseInt(newItem.stockQuantity)
            });
            alert("✅ Platillo agregado exitosamente");
            setNewItem({ name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: '' });
            fetchMenu();
        } catch (error) {
            alert("❌ Error al agregar platillo. Verifica los datos.");
        }
    };

    const handleUpdateStock = async (itemId, newStock) => {
        try {
            await api.patch(`/restaurants/menu/${itemId}/stock?newStock=${newStock}`);
            fetchMenu();
        } catch (error) {
            alert("❌ Error al actualizar stock");
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
    };

    const handleEditItemChange = (e) => {
        setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
    };

    const handleUpdateMenu = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/restaurants/menu/${editingItem.id}`, {
                ...editingItem,
                userId: restProfile.id,
                price: parseFloat(editingItem.price),
                stockQuantity: parseInt(editingItem.stockQuantity)
            });
            alert("✅ Platillo actualizado correctamente.");
            setEditingItem(null);
            fetchMenu();
        } catch (error) {
            alert("❌ Error al actualizar el platillo.");
        }
    };

    const handleProfileChange = (e) => {
        setRestProfile({ ...restProfile, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${restProfile.id}/profile`, {
                name: restProfile.name,
                phone: restProfile.phone,
                campus: restProfile.campus
            });
            alert("✅ ¡Datos del restaurante actualizados exitosamente!");

            const storedUser = JSON.parse(localStorage.getItem('udlaeats_user'));
            storedUser.name = restProfile.name;
            storedUser.phone = restProfile.phone;
            storedUser.campus = restProfile.campus;
            localStorage.setItem('udlaeats_user', JSON.stringify(storedUser));
        } catch (error) {
            alert("❌ Error al actualizar el local.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('udlaeats_user');
        navigate('/login');
    };

    return (
        <main className={styles.restMain}>

            {editingItem && (
                <section className={styles.modalOverlay} role="dialog">
                    <article className={styles.modalContent}>
                        <h3>Editar Platillo</h3>
                        <form className={styles.modalForm} onSubmit={handleUpdateMenu}>
                            <label>Nombre:
                                <input type="text" name="name" value={editingItem.name} onChange={handleEditItemChange} required />
                            </label>
                            <label>Categoría:
                                <select name="category" value={editingItem.category} onChange={handleEditItemChange} required>
                                    <option value="Bebidas">Bebidas</option>
                                    <option value="Snacks">Snacks / Piqueos</option>
                                    <option value="Almuerzos">Almuerzos</option>
                                    <option value="Postres">Postres</option>
                                </select>
                            </label>
                            <label>Precio $:
                                <input type="number" step="0.01" name="price" value={editingItem.price} onChange={handleEditItemChange} required min="0.1" />
                            </label>
                            <label>URL Imagen:
                                <input type="url" name="imageUrl" value={editingItem.imageUrl} onChange={handleEditItemChange} required />
                            </label>
                            <label>Descripción:
                                <input type="text" name="description" value={editingItem.description} onChange={handleEditItemChange} />
                            </label>

                            <menu className={styles.modalActions} style={{ padding: 0 }}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setEditingItem(null)}>Cancelar</button>
                                <button type="submit" className={styles.saveBtn}>Guardar Cambios</button>
                            </menu>
                        </form>
                    </article>
                </section>
            )}

            <nav className={styles.sideMenu}>
                <header><h3>Panel Restaurante</h3></header>
                <button onClick={() => setActiveTab('orders-queue')} className={activeTab === 'orders-queue' ? styles.activeTabBtn : styles.tabBtn}>Cola de Pedidos 🔴</button>
                <button onClick={() => setActiveTab('menu-management')} className={activeTab === 'menu-management' ? styles.activeTabBtn : styles.tabBtn}>Gestión de Menú</button>
                <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? styles.activeTabBtn : styles.tabBtn}>Configurar Local</button>
                <button onClick={handleLogout} className={styles.tabBtn} style={{ marginTop: 'auto', color: '#e74c3c' }}>Cerrar Sesión</button>
            </nav>

            <section className={styles.workspace}>
                {activeTab === 'orders-queue' && (
                    <section>
                        <header className={styles.workspaceHeader}>
                            <h3>Cola de Pedidos Pendientes</h3>
                            <p>Revisa el historial de los alumnos antes de preparar.</p>
                        </header>

                        <section style={{display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px'}}>
                            {orderQueue.length === 0 ? <p>No hay pedidos pendientes.</p> : (
                                orderQueue.map(order => (
                                    <article key={order.id} className={styles.menuStockCard} style={{padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <section>
                                            <h4 style={{margin: '0 0 0.5rem 0', color: '#d35400', fontSize: '1.3rem'}}>{order.itemName}</h4>
                                            <p style={{margin: '0 0 0.3rem 0'}}><strong>Alumno:</strong> {order.user.name}</p>
                                            <p style={{margin: '0 0 0.3rem 0'}}><strong>Hora:</strong> {order.orderTime.substring(0,5)}</p>

                                            {order.user.penaltyPoints > 0 ? (
                                                <small style={{color: '#e74c3c', fontWeight: 'bold'}}>⚠️ Puntos de penalidad: {order.user.penaltyPoints} (Sugerencia: No preparar hasta que llegue).</small>
                                            ) : (
                                                <small style={{color: '#27ae60', fontWeight: 'bold'}}>✅ Alumno Confiable (0 Penalidades).</small>
                                            )}
                                        </section>

                                        <menu style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, margin: 0}}>
                                            <button onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}>
                                                Empezar a Preparar
                                            </button>
                                            <button onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')} style={{background: '#27ae60', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
                                                Entregado ✔️
                                            </button>
                                            <button onClick={() => handleUpdateOrderStatus(order.id, 'NO_SHOW')} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
                                                No llegó (Multar) ❌
                                            </button>
                                        </menu>
                                    </article>
                                ))
                            )}
                        </section>
                    </section>
                )}

                {activeTab === 'menu-management' && (
                    <section>
                        <header className={styles.workspaceHeader}>
                            <h3>Mis Menús y Control de Stock</h3>
                            <p>Organiza tus platillos por categoría. La imagen debe ser una URL válida.</p>
                        </header>

                        <form className={styles.addMenuForm} onSubmit={handleAddMenu}>
                            <input type="text" name="name" placeholder="Nombre (ej. Combo Alitas)" value={newItem.name} onChange={handleNewItemChange} required />

                            <select name="category" value={newItem.category} onChange={handleNewItemChange} required>
                                <option value="" disabled>Seleccionar Categoría</option>
                                <option value="Bebidas">Bebidas</option>
                                <option value="Snacks">Snacks / Piqueos</option>
                                <option value="Almuerzos">Almuerzos</option>
                                <option value="Postres">Postres</option>
                            </select>

                            <input type="number" step="0.01" name="price" placeholder="Precio $" value={newItem.price} onChange={handleNewItemChange} required min="0.1" />
                            <input type="number" name="stockQuantity" placeholder="Stock Inicial" value={newItem.stockQuantity} onChange={handleNewItemChange} required min="1" />
                            <input type="url" name="imageUrl" placeholder="URL de la Imagen" value={newItem.imageUrl} onChange={handleNewItemChange} required className={styles.fullWidthInput} />
                            <input type="text" name="description" placeholder="Breve descripción de los ingredientes" value={newItem.description} onChange={handleNewItemChange} className={styles.fullWidthInput} />

                            <button type="submit" className={styles.submitMenuBtn}>Agregar al Menú</button>
                        </form>

                        <section className={styles.menuGrid}>
                            {menuItems.length === 0 ? (
                                <p>Aún no tienes platillos registrados.</p>
                            ) : (
                                menuItems.map(item => (
                                    <article key={item.id} className={styles.menuStockCard} style={{ opacity: item.available ? 1 : 0.6 }}>
                                        <figure className={styles.menuImageContainer}>
                                            <img src={item.imageUrl} alt={item.name} className={styles.menuImage} loading="lazy" />
                                            <span className={styles.categoryBadge}>{item.category}</span>
                                        </figure>
                                        <section className={styles.menuDetails}>
                                            <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <h4>{item.name}</h4>
                                                <button onClick={() => openEditModal(item)} className={styles.editMenuBtn}>Editar</button>
                                            </header>

                                            <p className={styles.menuDescription}>{item.description}</p>
                                            <p className={styles.menuPrice}>${item.price.toFixed(2)}</p>

                                            <footer className={styles.stockFooter}>
                                                <label>Stock disponible:</label>
                                                <input
                                                    type="number"
                                                    defaultValue={item.stockQuantity}
                                                    onBlur={(e) => handleUpdateStock(item.id, e.target.value)}
                                                    min="0"
                                                />
                                            </footer>
                                            {!item.available && <small className={styles.outOfStockAlert}>AGOTADO / OCULTO EN APP</small>}
                                        </section>
                                    </article>
                                ))
                            )}
                        </section>
                    </section>
                )}

                {activeTab === 'profile' && (
                    <section>
                        <h3>Datos Operativos del Establecimiento</h3>
                        <form className={styles.restForm} onSubmit={handleUpdateProfile}>
                            <label>
                                Nombre del Establecimiento:
                                <input type="text" name="name" value={restProfile.name} onChange={handleProfileChange} required />
                            </label>
                            <label>
                                Ubicación Física dentro del Campus:
                                <input type="text" name="campus" value={restProfile.campus} onChange={handleProfileChange} required />
                            </label>
                            <label>
                                Números Telefónicos:
                                <input type="tel" name="phone" value={restProfile.phone} onChange={handleProfileChange} required />
                            </label>
                            <label className={styles.alertLabel}>
                                Correo de Acceso (Bloqueado por seguridad):
                                <input type="email" value={restProfile.email} disabled />
                            </label>
                            <button type="submit" className={styles.saveRestBtn}>Guardar Datos</button>
                        </form>
                    </section>
                )}
            </section>
        </main>
    );
}