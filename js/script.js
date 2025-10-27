// Periksa Login data Pengguna
const userDataString = sessionStorage.getItem('loggedInUser');
if (!userDataString) {
    // Redirect index.html, jika Login sesuai
    window.location.href = 'index.html'; 
}
const user = JSON.parse(userDataString);

// Fungsi gretting: pagi, siang, sore, malam
function getGreeting(name) {
    const hour = new Date().getHours();
    let timeOfDay;
    if (hour >= 5 && hour < 12) {
        timeOfDay = "pagi";
    } else if (hour >= 12 && hour < 17) {
        timeOfDay = "siang";
    } else if (hour >= 17 && hour < 20) {
        timeOfDay = "sore";
    } else {
        timeOfDay = "malam";
    }
    return `Selamat ${timeOfDay}, ${name}`;
}

// Menampilkan Total Bahan Ajar dan Total Tracking
let totalUsers, totalItems, totalTracking; // Deklarasi agar variabel terdefinisi
if (typeof dataPengguna !== 'undefined' && typeof dataBahanAjar !== 'undefined' && typeof dataTracking !== 'undefined') {
    totalUsers = dataPengguna.length;
    totalItems = dataBahanAjar.length;
    totalTracking = Object.keys(dataTracking).length;
}

// Elemen Modal-Box dan tombol Close
const modalDetail = document.getElementById('modalDetail'); 
const closeModalBtn = document.getElementById('closeModal');

// Fungsi menutup Modal Detail
if (closeModalBtn) {
    closeModalBtn.onclick = function() {
        if (modalDetail) {
            modalDetail.style.display = "none";
        }
    }
}

// Fungsi mengisi data ke Modal Detail dan menampilkannya
function tampilkanModalDetail(dataBuku) {
    // Isi data ke elemen-elemen di Modal Box
    document.getElementById('modalCover').src = dataBuku.cover; 
    document.getElementById('modalNama').textContent = dataBuku.namaBarang;
    document.getElementById('modalKodeBarang').textContent = dataBuku.kodeBarang;
    document.getElementById('modalKodeLokasi').textContent = dataBuku.kodeLokasi;
    document.getElementById('modalJenis').textContent = dataBuku.jenisBarang;
    document.getElementById('modalEdisi').textContent = dataBuku.edisi;
    document.getElementById('modalStok').textContent = dataBuku.stok;

    // Tampilkan Modal
    if (modalDetail) {
        modalDetail.style.display = "block";
    }
}

// Modal Tambah Buku
const modalTambah = document.getElementById('modalTambah');
const closeModalTambahBtn = document.getElementById('closeModalTambah');
const btnTambahBuku = document.getElementById('btnTambahBuku');
const formTambahBuku = document.getElementById('formTambahBuku');

// Fungsi untuk menutup Modal Tambah
if (closeModalTambahBtn) {
    closeModalTambahBtn.onclick = function() {
        if (modalTambah) {
            modalTambah.style.display = "none";
            // Opsional: reset form
            if (formTambahBuku) formTambahBuku.reset();
        }
    }
}

// Event Listener untuk tombol 'Tambah Buku'
if (btnTambahBuku) {
    btnTambahBuku.addEventListener('click', () => {
        if (modalTambah) {
            modalTambah.style.display = 'block'; // Tampilkan modal
        }
    });
}

// Logika untuk submit form penambahan data
if (formTambahBuku) {
    formTambahBuku.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah form dari submit biasa
        
        // Ambil data dari form input
        const newBookData = {
            kodeLokasi: document.getElementById('inputKodeLokasi').value,
            kodeBarang: document.getElementById('inputKodeBarang').value, 
            namaBarang: document.getElementById('inputNamaBarang').value,
            jenisBarang: document.getElementById('inputJenisBarang').value,
            edisi: document.getElementById('inputEdisi').value,
            stok: document.getElementById('inputStok').value,
            cover: 'assets/default-cover.jpg' // Asumsi cover default
        };
        
        // penyimpanan data ke dataBahanAjar        
        alert(`Buku "${newBookData.namaBarang}" berhasil ditambahkan!`);
        
        modalTambah.style.display = 'none';
        formTambahBuku.reset();
        // Disarankan: Tambahkan fungsi untuk me-render ulang tabelBA di sini.
    });
}

// Menutup Modal jika klik diluar area Modal
window.onclick = function(event) {
    if (modalTambah && event.target === modalTambah) {
        modalTambah.style.display = "none";
        if (formTambahBuku) formTambahBuku.reset(); // reset form tambah jika ditutup
    }
    if (modalDetail && event.target === modalDetail) { 
        modalDetail.style.display = "none";
    }
}


// Logika Pengisian Tabel Bahan Ajar
if (typeof dataBahanAjar !== 'undefined') {
    const tabelBody = document.getElementById('tabelBodyBahanAjar');
    
    if (tabelBody) {
        // Loop melalui setiap objek di array dataBahanAjar
        dataBahanAjar.forEach((bahan, index) => {
            // Buat baris (<tr>) baru
            const row = tabelBody.insertRow();
            
            // Masukkan data ke dalam sel (<td>)
            row.insertCell().textContent = index + 1; // Kolom No (index + 1)
            row.insertCell().textContent = bahan.kodeLokasi;
            row.insertCell().textContent = bahan.kodeBarang;
            row.insertCell().textContent = bahan.namaBarang;
            row.insertCell().textContent = bahan.jenisBarang;
            row.insertCell().textContent = bahan.edisi;
            row.insertCell().textContent = bahan.stok;

            // Kolom Action (Tombol Detail)
            const actionCell = row.insertCell();
            const detailButton = document.createElement('button');
            detailButton.textContent = 'Detail';
            detailButton.className = 'btn-detail';
            // Tambahkan event listener 
            detailButton.addEventListener('click', () => {
                tampilkanModalDetail(bahan);
            });
            actionCell.appendChild(detailButton);
        });
    }
} else {
    console.warn("Variabel dataBahanAjar tidak ditemukan.");
}

// Logika Tracking Pengiriman
function initializeTracking() {
    const doNumberInput = document.getElementById('doNumberInput');
    const trackButton = document.getElementById('trackButton');
    const trackingResult = document.getElementById('trackingResult');
    const noDataMessage = document.getElementById('noDataMessage');
    const displayDoNumber = document.getElementById('displayDoNumber');
    const displayStatus = document.getElementById('displayStatus');
    const displayPenerima = document.getElementById('displayPenerima');
    const displayTanggalKirim = document.getElementById('displayTanggalKirim');
    const detailPerjalananList = document.getElementById('detailPerjalananList');
    
    if (!doNumberInput || !trackButton || !displayDoNumber) return;

    const trackData = (doNumber) => {
        // Akses dataTracking sebagai objek menggunakan key (doNumber)
        if (typeof dataTracking === 'undefined') {
            console.error("Variabel dataTracking tidak ditemukan.");
            if (noDataMessage) noDataMessage.style.display = 'block';
            if (trackingResult) trackingResult.style.display = 'none';
            return;
        }

        // Akses data menggunakan key Nomor DO
        const data = dataTracking[doNumber];

        if (data && trackingResult && noDataMessage) {
            // Nomor DO yang ditampilkan harus dari data, karena key bisa berbeda
            displayDoNumber.textContent = data.nomorDO; 
            displayStatus.textContent = data.status;
            // Gunakan properti 'nama' sebagai 'Penerima'
            displayPenerima.textContent = data.nama; 
            displayTanggalKirim.textContent = data.tanggalKirim;

            if (detailPerjalananList) {
                detailPerjalananList.innerHTML = ''; // Clear previous details
                
                // Gunakan 'perjalanan' dan properti 'waktu'/'keterangan', tampilkan terbalik
                const perjalananReverse = [...data.perjalanan].reverse(); 

                perjalananReverse.forEach(detail => {
                    const detailItem = document.createElement('div');
                    detailItem.classList.add('tracking-detail-item');
                    
                    // Format waktu menjadi tanggal dan jam
                    const [tanggal, jam] = detail.waktu.split(' '); 
                    
                    detailItem.innerHTML = `
                        <strong>${tanggal} ${jam}</strong><br>
                        ${detail.keterangan}
                    `;
                    detailPerjalananList.appendChild(detailItem);
                });
            }

            trackingResult.style.display = 'block';
            noDataMessage.style.display = 'none';
        } else if (trackingResult && noDataMessage) {
            trackingResult.style.display = 'none';
            noDataMessage.style.display = 'block';
        }
    };

    trackButton.addEventListener('click', () => {
        const doNumber = doNumberInput.value.trim();
        trackData(doNumber);
    });

    // Jalankan tracking pertama kali saat halaman dimuat dengan nilai default input
    trackData(doNumberInput.value.trim()); 
}

// DOMContentLoaded Listener 
document.addEventListener('DOMContentLoaded', () => {
    // Logika Dashboard
    const greetingText = document.getElementById('greetingText');
    const userRole = document.getElementById('userRole');
    const userLokasi = document.getElementById('userLokasi');
    const totalPengguna = document.getElementById('totalPengguna');
    const totalBahanAjar = document.getElementById('totalBahanAjar');
    const totalTrackingEl = document.getElementById('totalTracking');
    const stokBA = document.getElementById('stokBA');
    const trackingBA = document.getElementById('trackingBA');

    if (greetingText) greetingText.textContent = getGreeting(user.nama);
    if (userRole) userRole.textContent = `Role: ${user.role}`;
    if (userLokasi) userLokasi.textContent = `Lokasi: ${user.lokasi}`;

    // Display Totals (Hanya jalankan jika elemen ada)
    // Variabel totalUsers, totalItems, totalTracking didefinisikan di atas
    if (typeof totalUsers !== 'undefined' && totalPengguna) totalPengguna.textContent = totalUsers;
    if (typeof totalItems !== 'undefined' && totalBahanAjar) totalBahanAjar.textContent = totalItems;
    if (typeof totalTracking !== 'undefined' && totalTrackingEl) totalTrackingEl.textContent = totalTracking;
    
    // Dashboard Navigation
    if (stokBA) {
        stokBA.addEventListener('click', function() {
            window.location.href = 'stok.html';
        });
    }
    if (trackingBA) {
        trackingBA.addEventListener('click', function() {
            window.location.href = 'tracking.html';
        });
    }

    // Logika Tracking
    if (document.getElementById('doNumberInput')) {
        initializeTracking();
    }
    
    // Logika Logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            sessionStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    }
});