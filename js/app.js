
/* ==========================================
   SISTEM INFORMASI KEPEGAWAIAN
   PT ABADI JAYA
   ========================================== */

// Nama penyimpanan data
const STORAGE_KEY = "abadiJayaEmployees";

// Data awal untuk simulasi
const initialEmployees = [
    {
        nip: "AJ001",
        nama: "Andi Pratama",
        jk: "Laki-laki",
        tanggal: "1990-05-12",
        email: "andi@email.com",
        telepon: "081234567801",
        jabatan: "Manager",
        departemen: "HRD",
        alamat: "Kupang",
        status: "Aktif"
    },
    {
        nip: "AJ002",
        nama: "Budi Santoso",
        jk: "Laki-laki",
        tanggal: "1992-08-20",
        email: "budi@email.com",
        telepon: "081234567802",
        jabatan: "Staff IT",
        departemen: "Teknologi",
        alamat: "Kupang",
        status: "Aktif"
    },
    {
        nip: "AJ003",
        nama: "Citra Lestari",
        jk: "Perempuan",
        tanggal: "1995-03-15",
        email: "citra@email.com",
        telepon: "081234567803",
        jabatan: "Administrasi",
        departemen: "Administrasi",
        alamat: "Soe",
        status: "Aktif"
    },
    {
        nip: "AJ004",
        nama: "Dedi Kurniawan",
        jk: "Laki-laki",
        tanggal: "1989-11-10",
        email: "dedi@email.com",
        telepon: "081234567804",
        jabatan: "Akuntan",
        departemen: "Keuangan",
        alamat: "Atambua",
        status: "Nonaktif"
    },
    {
        nip: "AJ005",
        nama: "Siti Amelia",
        jk: "Perempuan",
        tanggal: "1997-07-22",
        email: "siti@email.com",
        telepon: "081234567805",
        jabatan: "Staff HRD",
        departemen: "HRD",
        alamat: "Kupang",
        status: "Aktif"
    }
];


/* ==========================================
   1. PENYIMPANAN DATA
========================================== */

// Mengambil data dari localStorage
function getEmployees() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Gagal membaca data:", error);
        return [];
    }
}

// Menyimpan data ke localStorage
function saveEmployees(employees) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(employees)
        );

        return true;
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
        alert("Penyimpanan gagal. Periksa ruang penyimpanan browser.");
        return false;
    }
}

// Membuat data awal jika penyimpanan masih kosong
function initializeData() {
    if (localStorage.getItem(STORAGE_KEY) === null) {
        saveEmployees(initialEmployees);
    }
}


/* ==========================================
   2. KEAMANAN TAMPILAN DATA
========================================== */

// Mencegah teks input dibaca sebagai HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[char];
    });
}


/* ==========================================
   3. MENAMPILKAN DATA PEGAWAI
========================================== */

function renderEmployees(data = getEmployees()) {

    const tableBody = document.getElementById(
        "employeeTableBody"
    );

    if (!tableBody) return;

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-data">
                    Tidak ada data pegawai ditemukan.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = data.map(employee => {

        const statusClass =
            employee.status === "Aktif"
                ? "active"
                : "inactive";

        return `
            <tr>
                <td>${escapeHTML(employee.nip)}</td>

                <td>
                    <strong>${escapeHTML(employee.nama)}</strong>
                </td>

                <td>${escapeHTML(employee.jk)}</td>

                <td>${escapeHTML(employee.jabatan)}</td>

                <td>${escapeHTML(employee.departemen)}</td>

                <td>
                    <span class="status ${statusClass}">
                        ${escapeHTML(employee.status)}
                    </span>
                </td>

                <td>
                    <div class="action-buttons">

                        <button
                            class="btn-edit"
                            data-action="edit"
                            data-nip="${escapeHTML(employee.nip)}">
                            Edit
                        </button>

                        <button
                            class="btn-delete"
                            data-action="delete"
                            data-nip="${escapeHTML(employee.nip)}">
                            Hapus
                        </button>

                    </div>
                </td>
            </tr>
        `;

    }).join("");
}


/* ==========================================
   4. FITUR PENCARIAN
========================================== */

function searchEmployees() {

    const searchInput = document.getElementById(
        "searchInput"
    );

    const statusFilter = document.getElementById(
        "statusFilter"
    );

    if (!searchInput || !statusFilter) return;

    const keyword = searchInput.value
        .toLowerCase()
        .trim();

    const selectedStatus = statusFilter.value;

    const filteredEmployees = getEmployees().filter(employee => {

        const matchesKeyword =
            employee.nama.toLowerCase().includes(keyword) ||
            employee.nip.toLowerCase().includes(keyword);

        const matchesStatus =
            selectedStatus === "" ||
            employee.status === selectedStatus;

        return matchesKeyword && matchesStatus;

    });

    renderEmployees(filteredEmployees);
}


/* ==========================================
   5. MENAMBAHKAN PEGAWAI
========================================== */

function addEmployee(employee) {

    const employees = getEmployees();

    // Memeriksa NIP ganda
    const existing = employees.some(item =>
        item.nip.toLowerCase() === employee.nip.toLowerCase()
    );

    if (existing) {
        return false;
    }

    employees.push(employee);

    return saveEmployees(employees);
}


/* ==========================================
   6. MENGEDIT PEGAWAI
========================================== */

function updateEmployee(nip, updatedData) {

    const employees = getEmployees();

    const index = employees.findIndex(
        employee => employee.nip === nip
    );

    if (index === -1) return false;

    employees[index] = updatedData;

    return saveEmployees(employees);
}


/* ==========================================
   7. MENGHAPUS PEGAWAI
========================================== */

function deleteEmployee(nip) {

    const employees = getEmployees();

    const filteredEmployees = employees.filter(
        employee => employee.nip !== nip
    );

    if (filteredEmployees.length === employees.length) {
        return false;
    }

    return saveEmployees(filteredEmployees);
}


/* ==========================================
   8. FORM TAMBAH DAN EDIT
========================================== */

function setupEmployeeForm() {

    const form = document.getElementById(
        "employeeForm"
    );

    if (!form) return;

    const params = new URLSearchParams(
        window.location.search
    );

    const editNip = params.get("edit");

    const message = document.getElementById(
        "formMessage"
    );

    const nipInput = document.getElementById("nip");

    // Mode edit
    if (editNip) {

        const employee = getEmployees().find(
            item => item.nip === editNip
        );

        if (!employee) {
            alert("Data pegawai tidak ditemukan.");
            window.location.href = "pegawai.html";
            return;
        }

        document.querySelector(".page-heading h1").textContent =
            "Edit Data Pegawai";

        nipInput.readOnly = true;

        document.querySelector(
            '.form-actions button[type="submit"]'
        ).textContent = "Simpan Perubahan";

        // Mengisi formulir dengan data sebelumnya
        Object.keys(employee).forEach(key => {

            const input = document.getElementById(key);

            if (input) {
                input.value = employee[key];
            }

        });
    }

    // Proses ketika formulir dikirim
    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const employee = {
            nip: nipInput.value.trim(),
            nama: document.getElementById("nama").value.trim(),
            jk: document.getElementById("jk").value,
            tanggal: document.getElementById("tanggal").value,
            email: document.getElementById("email").value.trim(),
            telepon: document.getElementById("telepon").value.trim(),
            jabatan: document.getElementById("jabatan").value,
            departemen: document.getElementById("departemen").value,
            alamat: document.getElementById("alamat").value.trim(),
            status: document.getElementById("status").value
        };

        let success;

        if (editNip) {

            success = updateEmployee(editNip, employee);

        } else {

            success = addEmployee(employee);

        }

        if (!success) {

            showMessage(
                message,
                "NIP sudah digunakan atau data gagal disimpan.",
                "error"
            );

            return;
        }

        showMessage(
            message,
            editNip
                ? "Data pegawai berhasil diperbarui!"
                : "Data pegawai berhasil ditambahkan!",
            "success"
        );

        setTimeout(() => {
            window.location.href = "pegawai.html";
        }, 1000);

    });
}


/* ==========================================
   9. PESAN PEMBERITAHUAN
========================================== */

function showMessage(element, text, type) {

    if (!element) return;

    element.textContent = text;
    element.className = "form-message " + type;
}


/* ==========================================
   10. TOMBOL EDIT DAN HAPUS
========================================== */

function setupTableActions() {

    const tableBody = document.getElementById(
        "employeeTableBody"
    );

    if (!tableBody) return;

    tableBody.addEventListener("click", function(event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const nip = button.dataset.nip;
        const action = button.dataset.action;

        if (action === "edit") {

            window.location.href =
                "tambah-pegawai.html?edit=" +
                encodeURIComponent(nip);

        }

        if (action === "delete") {

            const confirmation = confirm(
                "Apakah kamu yakin ingin menghapus data pegawai " +
                nip + "?"
            );

            if (!confirmation) return;

            if (deleteEmployee(nip)) {

                searchEmployees();
                updateDashboard();

                alert("Data pegawai berhasil dihapus!");

            }

        }

    });
}


/* ==========================================
   11. DASHBOARD STATISTIK
========================================== */

function updateDashboard() {

    const employees = getEmployees();

    const total = employees.length;

    const active = employees.filter(
        item => item.status === "Aktif"
    ).length;

    const inactive = employees.filter(
        item => item.status === "Nonaktif"
    ).length;

    const departments = new Set(
        employees.map(item => item.departemen)
    ).size;

    const values = [total, active, inactive, departments];

    const cards = document.querySelectorAll(
        ".stats-grid .stat-card h2"
    );

    cards.forEach((card, index) => {
        if (values[index] !== undefined) {
            card.textContent = values[index];
        }
    });

    // Memperbarui tabel terbaru di dashboard
    const dashboardBody = document.getElementById(
        "dashboardEmployeeBody"
    );

    if (dashboardBody) {

        dashboardBody.innerHTML = employees
            .slice(0, 5)
            .map(employee => {

                const statusClass =
                    employee.status === "Aktif"
                        ? "active"
                        : "inactive";

                return `
                    <tr>
                        <td>${escapeHTML(employee.nip)}</td>
                        <td>${escapeHTML(employee.nama)}</td>
                        <td>${escapeHTML(employee.jabatan)}</td>
                        <td>${escapeHTML(employee.departemen)}</td>
                        <td>
                            <span class="status ${statusClass}">
                                ${escapeHTML(employee.status)}
                            </span>
                        </td>
                    </tr>
                `;

            }).join("");

    }
}


/* ==========================================
   12. MENJALANKAN PROGRAM
========================================== */

document.addEventListener("DOMContentLoaded", function() {

    initializeData();

    renderEmployees();

    setupEmployeeForm();

    setupTableActions();

    updateDashboard();

    const searchInput = document.getElementById(
        "searchInput"
    );

    const statusFilter = document.getElementById(
        "statusFilter"
    );

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            searchEmployees
        );
    }

    if (statusFilter) {
        statusFilter.addEventListener(
            "change",
            searchEmployees
        );
    }

});
