document.getElementById('loginForm').addEventListener('submit', function(event) {
            // Mencegah submit form standar (reload halaman)
            event.preventDefault(); 

            // Mengambil nilai input
            const email = document.getElementById('emailInput').value.trim();
            const password = document.getElementById('passwordInput').value;
            const alertBox = document.getElementById('alertMessage');

            // Reset pesan alert
            alertBox.classList.add('d-none');
            alertBox.classList.remove('alert-danger', 'alert-success');
            alertBox.textContent = '';

            // Mencari pengguna di array dataPengguna (dari data.js)
            const user = dataPengguna.find(
                p => p.email === email && p.password === password
            );

            if (user) {
                // Login Berhasil
                
                // Menyimpan data pengguna ke Session Storage
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));

                // Menampilkan pesan sukses (opsional, bisa langsung redirect)
                alertBox.classList.remove('d-none');
                alertBox.classList.add('alert-success');
                alertBox.textContent = 'Login berhasil! Mengalihkan...';

                // Mengalihkan ke dashboard.html setelah jeda singkat
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 500);

            } else {
                // Login Gagal
                alertBox.classList.remove('d-none');
                alertBox.classList.add('alert-danger');
                alertBox.textContent = 'Email atau password salah. Silakan coba lagi.';
            }
        });