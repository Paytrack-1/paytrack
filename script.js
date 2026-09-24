// --- DATOS LOCALSTORAGE ---
let users = JSON.parse(localStorage.getItem('app_users')) || [
    { user: 'admin', pass: '1234', role: 'admin' }
];

let payments = JSON.parse(localStorage.getItem('app_payments')) || [
    { id: 1, user: 'cliente1', dni: 'V-12345678', phone: '04121234567', method: 'Cashea', amount: 45.00, ref: 'Cuota 1/3', status: 'Pagado', datetime: '2026-09-23 10:15', image: '' },
    { id: 2, user: 'cliente1', dni: 'V-12345678', phone: '04121234567', method: 'Pago Móvil', amount: 120.00, ref: '987654', status: 'Pagado', datetime: '2026-09-23 14:30', image: '' },
    { id: 3, user: 'Empresa Alpha C.A.', dni: 'J-87654321', phone: '04147654321', method: 'Pago Móvil', amount: 80.00, ref: '112233', status: 'Pagado', datetime: '2026-09-22 09:20', image: '' }
];

let currentUser = null;

const methodColors = {
    'Pago Móvil': '#1A1A1D',
    'Cashea': '#5E6572',
    'Punto de Venta': '#8D99AE',
    'Efectivo': '#3C3F45'
};

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${type === 'success' ? '✓' : '✕'} ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- ELEMENTOS DOM ---
const landingContainer = document.getElementById('landing-container');
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const appSidebar = document.getElementById('app-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

const navLoginBtn = document.getElementById('nav-login-btn');
const navRegisterBtn = document.getElementById('nav-register-btn');
const heroGetStarted = document.getElementById('hero-get-started');
const ctaRegisterBtn = document.getElementById('cta-register-btn');
const backToLanding = document.getElementById('back-to-landing');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

// Pestañas
const tabHistoryBtn = document.getElementById('tab-history-btn');
const tabSummaryBtn = document.getElementById('tab-summary-btn');

const viewHistory = document.getElementById('view-history');
const viewSummary = document.getElementById('view-summary');

// Modales y Campos de Entrada
const paymentModal = document.getElementById('payment-modal');
const openPaymentModalBtn = document.getElementById('open-payment-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalClientInput = document.getElementById('modal-client-input');
const modalClientDni = document.getElementById('modal-client-dni');
const modalClientPhone = document.getElementById('modal-client-phone');
const clientsList = document.getElementById('clients-list');

// Modal Editar
const editPaymentModal = document.getElementById('edit-payment-modal');
const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const editPaymentForm = document.getElementById('edit-payment-form');
const editPaymentId = document.getElementById('edit-payment-id');
const editClientInput = document.getElementById('edit-client-input');
const editClientDni = document.getElementById('edit-client-dni');
const editClientPhone = document.getElementById('edit-client-phone');
const editPayMethod = document.getElementById('edit-pay-method');
const editPayStatus = document.getElementById('edit-pay-status');
const editPayAmount = document.getElementById('edit-pay-amount');
const editPayRef = document.getElementById('edit-pay-ref');

const imageViewerModal = document.getElementById('image-viewer-modal');
const viewerFullImage = document.getElementById('viewer-full-image');
const closeViewerBtn = document.getElementById('close-viewer-btn');

const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

const paymentForm = document.getElementById('payment-form');
const paymentRowsContainer = document.getElementById('payment-rows-container');
const addPaymentRowBtn = document.getElementById('add-payment-row');
const paymentTableBody = document.getElementById('payment-table-body');

const searchInput = document.getElementById('search-input');
const filterStatusSelect = document.getElementById('filter-status');
const exportExcelBtn = document.getElementById('export-excel-btn');
const statsDatePicker = document.getElementById('stats-date-picker');
const resetDateBtn = document.getElementById('reset-date-btn');

const svgDonut = document.getElementById('svg-donut');
const chartLegend = document.getElementById('chart-legend');

// KPIS & BARRAS
const kpiTotalAmount = document.getElementById('kpi-total-amount');
const kpiTotalTx = document.getElementById('kpi-total-tx');
const kpiEffectiveRate = document.getElementById('kpi-effective-rate');
const kpiTopFreqClient = document.getElementById('kpi-top-freq-client');
const kpiTopSpentClient = document.getElementById('kpi-top-spent-client');
const barChartContainer = document.getElementById('bar-chart-container');

// CONTROL DEL SIDEBAR EN MÓVIL
function openSidebar() {
    appSidebar.classList.add('open');
    sidebarOverlay.classList.remove('hidden');
}

function closeSidebar() {
    appSidebar.classList.remove('open');
    sidebarOverlay.classList.add('hidden');
}

mobileMenuToggle.addEventListener('click', openSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// PESTAÑAS
function switchTab(activeBtn, activeView) {
    [tabHistoryBtn, tabSummaryBtn].forEach(btn => btn.classList.remove('active'));
    [viewHistory, viewSummary].forEach(view => view.classList.add('hidden'));

    activeBtn.classList.add('active');
    activeView.classList.remove('hidden');

    if (activeView === viewSummary) renderMetrics();
    closeSidebar();
}

tabHistoryBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab(tabHistoryBtn, viewHistory); });
tabSummaryBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab(tabSummaryBtn, viewSummary); });

// NAVEGACIÓN
function goToAuth(showRegister = false) {
    landingContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    if (showRegister) {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

navLoginBtn.addEventListener('click', () => goToAuth(false));
navRegisterBtn.addEventListener('click', () => goToAuth(true));
heroGetStarted.addEventListener('click', () => goToAuth(true));
ctaRegisterBtn.addEventListener('click', () => goToAuth(true));

backToLanding.addEventListener('click', () => {
    authContainer.classList.add('hidden');
    landingContainer.classList.remove('hidden');
});

showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginForm.classList.add('hidden'); registerForm.classList.remove('hidden'); });
showLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerForm.classList.add('hidden'); loginForm.classList.remove('hidden'); });

// REGISTRO / LOGIN
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('reg-user').value.trim();
    const pass = document.getElementById('reg-pass').value.trim();

    if (users.find(u => u.user === user)) { 
        showToast('El usuario ya está registrado', 'error'); 
        return; 
    }

    users.push({ user, pass, role: 'admin' });
    localStorage.setItem('app_users', JSON.stringify(users));
    showToast('¡Administrador registrado con éxito!', 'success');
    registerForm.reset();
    showLoginLink.click();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();

    const foundUser = users.find(u => u.user === user && u.pass === pass);

    if (foundUser) {
        currentUser = foundUser;
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        openPaymentModalBtn.classList.remove('hidden');
        userDisplay.textContent = `${currentUser.user} (ADMIN)`;
        showToast(`Bienvenido, ${currentUser.user}`, 'success');
        
        setupDashboard();
    } else {
        showToast('Usuario o contraseña incorrectos', 'error');
    }
});

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    appContainer.classList.add('hidden');
    openPaymentModalBtn.classList.add('hidden');
    landingContainer.classList.remove('hidden');
    loginForm.reset();
    closeSidebar();
    showToast('Sesión cerrada correctamente', 'success');
});

// MODAL Y CLIENTES SUGERIDOS
openPaymentModalBtn.addEventListener('click', () => {
    updateClientDatalist();
    paymentModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => paymentModal.classList.add('hidden'));
closeViewerBtn.addEventListener('click', () => imageViewerModal.classList.add('hidden'));

closeEditModalBtn.addEventListener('click', () => editPaymentModal.classList.add('hidden'));
cancelEditBtn.addEventListener('click', () => editPaymentModal.classList.add('hidden'));

function updateClientDatalist() {
    clientsList.innerHTML = '';
    const uniqueClients = [...new Set(payments.map(p => p.user))];
    uniqueClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client;
        clientsList.appendChild(option);
    });
}

// Auto-completar Cédula y Teléfono al seleccionar cliente existente
modalClientInput.addEventListener('input', () => {
    const val = modalClientInput.value.trim();
    const match = payments.find(p => p.user.toLowerCase() === val.toLowerCase());
    if (match) {
        if (match.dni) modalClientDni.value = match.dni;
        if (match.phone) modalClientPhone.value = match.phone;
    }
});

// PREVISUALIZACIÓN DE IMÁGENES
window.previewImage = function(input) {
    const previewBox = input.parentElement.querySelector('.img-preview-box');
    const imgElement = previewBox.querySelector('.img-preview');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgElement.src = e.target.result;
            previewBox.classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.removeImage = function(btn) {
    const previewBox = btn.parentElement;
    const input = previewBox.parentElement.querySelector('.pay-image-input');
    input.value = '';
    previewBox.querySelector('.img-preview').src = '';
    previewBox.classList.add('hidden');
};

// FILAS EN MODAL
addPaymentRowBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'payment-row';
    row.innerHTML = `
        <div class="form-group">
            <label>Método:</label>
            <select class="pay-method" required>
                <option value="Pago Móvil">Pago Móvil</option>
                <option value="Punto de Venta">Punto de Venta</option>
                <option value="Cashea">Cashea</option>
                <option value="Efectivo">Efectivo</option>
            </select>
        </div>
        <div class="form-group">
            <label>Estado:</label>
            <select class="pay-status" required>
                <option value="Pagado">Pagado</option>
                <option value="En Proceso">En Proceso</option>
            </select>
        </div>
        <div class="form-group">
            <label>Monto ($):</label>
            <input type="number" class="pay-amount" step="0.01" placeholder="0.00" required>
        </div>
        <div class="form-group">
            <label>Referencia:</label>
            <input type="text" class="pay-ref" placeholder="Ej: Ref 123456" required>
        </div>
        <div class="form-group img-upload-group">
            <label>Captura/Factura:</label>
            <input type="file" class="pay-image-input" accept="image/*" onchange="previewImage(this)">
            <div class="img-preview-box hidden">
                <img src="" alt="Previsualización" class="img-preview">
                <button type="button" class="btn-remove-img" onclick="removeImage(this)">✕</button>
            </div>
        </div>
        <button type="button" class="btn-remove-row">✕</button>
    `;

    row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
    paymentRowsContainer.appendChild(row);
});

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const targetUser = modalClientInput.value.trim();
    const dni = modalClientDni.value.trim();
    const phone = modalClientPhone.value.trim();
    const rows = paymentRowsContainer.querySelectorAll('.payment-row');
    
    const now = new Date();
    const formattedDateTime = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');

    rows.forEach((row) => {
        const method = row.querySelector('.pay-method').value;
        const status = row.querySelector('.pay-status').value;
        const amount = parseFloat(row.querySelector('.pay-amount').value);
        const ref = row.querySelector('.pay-ref').value;
        const imgElement = row.querySelector('.img-preview');
        const imageData = imgElement ? imgElement.src : '';

        payments.push({
            id: Date.now() + Math.random(),
            user: targetUser,
            dni: dni,
            phone: phone,
            method,
            amount,
            ref,
            status,
            datetime: formattedDateTime,
            image: imageData
        });
    });

    localStorage.setItem('app_payments', JSON.stringify(payments));
    paymentModal.classList.add('hidden');
    modalClientInput.value = '';
    modalClientDni.value = '';
    modalClientPhone.value = '';
    showToast('Pago(s) registrado(s) correctamente', 'success');
    
    paymentRowsContainer.innerHTML = `
        <div class="payment-row">
            <div class="form-group">
                <label>Método:</label>
                <select class="pay-method" required>
                    <option value="Pago Móvil">Pago Móvil</option>
                    <option value="Punto de Venta">Punto de Venta</option>
                    <option value="Cashea">Cashea</option>
                    <option value="Efectivo">Efectivo</option>
                </select>
            </div>
            <div class="form-group">
                <label>Estado:</label>
                <select class="pay-status" required>
                    <option value="Pagado">Pagado</option>
                    <option value="En Proceso">En Proceso</option>
                </select>
            </div>
            <div class="form-group">
                <label>Monto ($):</label>
                <input type="number" class="pay-amount" step="0.01" placeholder="0.00" required>
            </div>
            <div class="form-group">
                <label>Referencia:</label>
                <input type="text" class="pay-ref" placeholder="Ej: Ref 123456" required>
            </div>
            <div class="form-group img-upload-group">
                <label>Captura/Factura:</label>
                <input type="file" class="pay-image-input" accept="image/*" onchange="previewImage(this)">
                <div class="img-preview-box hidden">
                    <img src="" alt="Previsualización" class="img-preview">
                    <button type="button" class="btn-remove-img" onclick="removeImage(this)">✕</button>
                </div>
            </div>
            <button type="button" class="btn-remove-row hidden">✕</button>
        </div>
    `;

    setupDashboard();
});

// TABLA Y DASHBOARD
function setupDashboard() {
    renderTable();
    renderMetrics();
}

searchInput.addEventListener('input', renderTable);
filterStatusSelect.addEventListener('change', renderTable);
statsDatePicker.addEventListener('change', renderMetrics);
resetDateBtn.addEventListener('click', () => {
    statsDatePicker.value = '';
    renderMetrics();
});

function renderTable() {
    paymentTableBody.innerHTML = '';
    let visible = [...payments];

    const term = searchInput.value.toLowerCase().trim();
    if (term) {
        visible = visible.filter(p => 
            p.user.toLowerCase().includes(term) ||
            (p.dni && p.dni.toLowerCase().includes(term)) ||
            (p.phone && p.phone.toLowerCase().includes(term)) ||
            p.method.toLowerCase().includes(term) ||
            p.ref.toLowerCase().includes(term) ||
            (p.datetime && p.datetime.includes(term))
        );
    }

    const selectedFilter = filterStatusSelect.value;
    if (selectedFilter !== 'TODOS') {
        visible = visible.filter(p => p.status === selectedFilter);
    }

    visible.forEach(p => {
        const tr = document.createElement('tr');

        let statusClass = 'status-proceso';
        if (p.status === 'Pagado') statusClass = 'status-pagado';
        if (p.status === 'No Registrado') statusClass = 'status-no-registrado';

        const imageContent = p.image ? 
            `<img src="${p.image}" class="thumb-img" onclick="viewImage('${p.image}')" alt="Comprobante">` : 
            `<span class="no-img-text">Sin foto</span>`;

        tr.innerHTML = `
            <td class="date-cell">${p.datetime || 'N/A'}</td>
            <td><strong>${p.user}</strong></td>
            <td>${p.dni || 'N/A'}</td>
            <td>${p.phone || 'N/A'}</td>
            <td>${imageContent}</td>
            <td>${p.method}</td>
            <td>$${p.amount.toFixed(2)}</td>
            <td>${p.ref}</td>
            <td><span class="badge ${statusClass}">${p.status}</span></td>
            <td>
                <div class="action-buttons-group">
                    <button class="btn-table-edit" onclick="openEditModal(${p.id})">Editar</button>
                    <button class="btn-table-delete" onclick="deletePayment(${p.id})">Borrar</button>
                </div>
            </td>
        `;

        paymentTableBody.appendChild(tr);
    });
}

// ABRIR Y GUARDAR EDICIÓN DE PAGO
window.openEditModal = function(id) {
    const p = payments.find(item => item.id === id);
    if (!p) return;

    editPaymentId.value = p.id;
    editClientInput.value = p.user;
    editClientDni.value = p.dni || '';
    editClientPhone.value = p.phone || '';
    editPayMethod.value = p.method;
    editPayStatus.value = p.status;
    editPayAmount.value = p.amount;
    editPayRef.value = p.ref;

    editPaymentModal.classList.remove('hidden');
};

editPaymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseFloat(editPaymentId.value);
    const payment = payments.find(p => p.id === id);

    if (payment) {
        payment.user = editClientInput.value.trim();
        payment.dni = editClientDni.value.trim();
        payment.phone = editClientPhone.value.trim();
        payment.method = editPayMethod.value;
        payment.status = editPayStatus.value;
        payment.amount = parseFloat(editPayAmount.value);
        payment.ref = editPayRef.value.trim();

        localStorage.setItem('app_payments', JSON.stringify(payments));
        editPaymentModal.classList.add('hidden');
        showToast('Pago actualizado con éxito', 'success');
        setupDashboard();
    }
});

// ABRIR COMPROBANTE COMPLETO
window.viewImage = function(src) {
    viewerFullImage.src = src;
    imageViewerModal.classList.remove('hidden');
};

// EXPORTACIÓN A EXCEL (.CSV) CON CÉDULA Y TELÉFONO
exportExcelBtn.addEventListener('click', () => {
    if (payments.length === 0) {
        showToast('No hay datos para exportar', 'error');
        return;
    }

    let csvContent = '\uFEFF';
    csvContent += 'Fecha y Hora;Cliente;Cédula;Teléfono;Método;Monto ($);Referencia;Estado\n';

    payments.forEach(p => {
        csvContent += `"${p.datetime || ''}";"${p.user}";"${p.dni || ''}";"${p.phone || ''}";"${p.method}";"${p.amount.toFixed(2)}";"${p.ref}";"${p.status}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PayTrack_Pagos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reporte exportado correctamente', 'success');
});

// METRICAS FILTRADAS POR FECHA Y ANALISIS DE CLIENTES
function renderMetrics() {
    const selectedDate = statsDatePicker.value;
    const counts = { 'Pago Móvil': 0, 'Cashea': 0, 'Punto de Venta': 0, 'Efectivo': 0 };
    const clientTxCounts = {};
    const clientSpentTotals = {};

    let totalAmount = 0;
    let paidAmount = 0;
    let txCount = 0;

    payments.forEach(p => {
        if (!selectedDate || (p.datetime && p.datetime.startsWith(selectedDate))) {
            if (counts[p.method] !== undefined) {
                counts[p.method] += p.amount;
                totalAmount += p.amount;
                txCount++;
                if (p.status === 'Pagado') paidAmount += p.amount;

                // Conteo de compras por cliente
                clientTxCounts[p.user] = (clientTxCounts[p.user] || 0) + 1;

                // Suma de gastos por cliente
                clientSpentTotals[p.user] = (clientSpentTotals[p.user] || 0) + p.amount;
            }
        }
    });

    // Calcular cliente con más compras (Frecuente)
    let topFreqClientName = 'Ninguno';
    let maxTx = 0;
    for (const [client, numTx] of Object.entries(clientTxCounts)) {
        if (numTx > maxTx) {
            maxTx = numTx;
            topFreqClientName = `${client} (${numTx} compras)`;
        }
    }

    // Calcular cliente que más gastó
    let topSpentClientName = 'Ninguno';
    let maxSpent = 0;
    for (const [client, spent] of Object.entries(clientSpentTotals)) {
        if (spent > maxSpent) {
            maxSpent = spent;
            topSpentClientName = `${client} ($${spent.toFixed(2)})`;
        }
    }

    kpiTotalAmount.textContent = `$${totalAmount.toFixed(2)}`;
    kpiTotalTx.textContent = txCount;
    const rate = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
    kpiEffectiveRate.textContent = `${rate.toFixed(1)}%`;
    kpiTopFreqClient.textContent = topFreqClientName;
    kpiTopSpentClient.textContent = topSpentClientName;

    const existingSegments = svgDonut.querySelectorAll('.donut-segment');
    existingSegments.forEach(s => s.remove());
    chartLegend.innerHTML = '';
    barChartContainer.innerHTML = '';

    if (totalAmount === 0) {
        chartLegend.innerHTML = '<p>No hay registros para la fecha elegida.</p>';
        return;
    }

    let offset = 0;
    Object.keys(counts).forEach(method => {
        const amount = counts[method];
        const percent = (amount / totalAmount) * 100;

        if (percent > 0) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', 'donut-segment');
            circle.setAttribute('cx', '21'); circle.setAttribute('cy', '21');
            circle.setAttribute('r', '15.91549430918954');
            circle.setAttribute('fill', 'transparent');
            circle.setAttribute('stroke', methodColors[method]);
            circle.setAttribute('stroke-width', '5');
            circle.setAttribute('stroke-dasharray', `${percent} ${100 - percent}`);
            circle.setAttribute('stroke-dashoffset', `${100 - offset}`);

            svgDonut.appendChild(circle);
            offset += percent;
        }

        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <span class="legend-color" style="background-color: ${methodColors[method]}"></span>
            <strong>${method}:</strong> $${amount.toFixed(2)} (${percent.toFixed(1)}%)
        `;
        chartLegend.appendChild(item);

        const barItem = document.createElement('div');
        barItem.className = 'bar-item';
        barItem.innerHTML = `
            <div class="bar-info">
                <span>${method}</span>
                <span>$${amount.toFixed(2)}</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill" style="width: ${percent}%; background-color: ${methodColors[method]}"></div>
            </div>
        `;
        barChartContainer.appendChild(barItem);
    });
}

window.deletePayment = function(id) {
    if (confirm('¿Estás seguro de que deseas borrar este registro?')) {
        payments = payments.filter(p => p.id !== id);
        localStorage.setItem('app_payments', JSON.stringify(payments));
        showToast('Registro eliminado con éxito', 'success');
        setupDashboard();
    }
};