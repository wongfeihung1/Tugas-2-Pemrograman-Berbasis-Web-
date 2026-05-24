// ================================
// Fungsi global — buka & tutup modal
// ================================
function bukaModal(id) {
  document.getElementById(id).style.display = 'flex';
}
 
function tutupModal(id) {
  document.getElementById(id).style.display = 'none';
}
 
// ================================
// Kirim reset password
// ================================
function kirimReset() {
  var email = document.getElementById('inputResetEmail').value;
  if (!email) {
    alert('Masukkan email terlebih dahulu!');
    return;
  }
  tutupModal('modalLupaPass');
  alert('Instruksi reset password sudah dikirim ke ' + email);
}
 
// ================================
// Kirim daftar akun
// ================================
function kirimDaftar() {
  var nama  = document.getElementById('regNama').value;
  var email = document.getElementById('regEmail').value;
  var pass  = document.getElementById('regPass').value;
  if (!nama || !email || !pass) {
    alert('Semua field wajib diisi!');
    return;
  }
  tutupModal('modalDaftar');
  alert('Pendaftaran berhasil dikirim! Tunggu konfirmasi admin.');
}
 
// ================================
// Semua kode dijalankan setelah DOM siap
// ================================
document.addEventListener('DOMContentLoaded', function () {
 
  // ================================
  // INDEX.HTML — Login & modal
  // ================================
 
  var btnLupa = document.getElementById('btnLupaPassword');
  if (btnLupa) {
    btnLupa.addEventListener('click', function (e) {
      e.preventDefault();
      bukaModal('modalLupaPass');
    });
  }
 
  var btnDaftar = document.getElementById('btnDaftar');
  if (btnDaftar) {
    btnDaftar.addEventListener('click', function (e) {
      e.preventDefault();
      bukaModal('modalDaftar');
    });
  }
 
  var formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
 
      var email    = document.getElementById('inputEmail').value.trim();
      var password = document.getElementById('inputPassword').value;
      var errEmail = document.getElementById('errorEmail');
      var errPass  = document.getElementById('errorPassword');
 
      errEmail.textContent = '';
      errPass.textContent  = '';
      var valid = true;
 
      if (!email) {
        errEmail.textContent = 'Email tidak boleh kosong.';
        errEmail.style.color = 'red';
        errEmail.style.fontSize = '12px';
        valid = false;
      }
      if (!password) {
        errPass.textContent = 'Password tidak boleh kosong.';
        errPass.style.color = 'red';
        errPass.style.fontSize = '12px';
        valid = false;
      }
      if (!valid) return;
 
      var user = dataPengguna.find(function (u) {
        return u.email === email && u.password === password;
      });
 
      if (user) {
        sessionStorage.setItem('userLogin', JSON.stringify(user));
        window.location.href = 'dashboard.html';
      } else {
        bukaModal('modalGagal');
      }
    });
  }
 
  // ================================
  // DASHBOARD.HTML
  // ================================
 
  if (document.getElementById('sapaan')) {
 
    // Cek login
    var userLogin = JSON.parse(sessionStorage.getItem('userLogin'));
    if (!userLogin) {
      window.location.href = 'index.html';
    }
 
    // Greeting berdasarkan jam
    var jam  = new Date().getHours();
    var sapa = '';
    if (jam >= 5 && jam < 11)       sapa = 'Selamat Pagi';
    else if (jam >= 11 && jam < 15) sapa = 'Selamat Siang';
    else if (jam >= 15 && jam < 18) sapa = 'Selamat Sore';
    else                            sapa = 'Selamat Malam';
 
    document.getElementById('sapaan').textContent    = sapa + ', ' + userLogin.nama + '!';
    document.getElementById('info-user').textContent = 'Role: ' + userLogin.role + ' | Lokasi: ' + userLogin.lokasi;
 
    // Statistik
    var totalBahan = dataBahanAjar.length;
    var totalStok  = dataBahanAjar.reduce(function (sum, item) { return sum + item.stok; }, 0);
    var totalDO    = Object.values(dataTracking).filter(function (d) { return d.status === 'Dalam Perjalanan'; }).length;
    var hari       = new Date();
    var opsi       = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
 
    document.getElementById('totalBahan').textContent      = totalBahan;
    document.getElementById('totalStok').textContent       = totalStok.toLocaleString('id-ID');
    document.getElementById('totalDO').textContent         = totalDO;
    document.getElementById('tanggalHari').style.fontSize  = '21px';
    document.getElementById('tanggalHari').textContent     = hari.toLocaleDateString('id-ID', opsi);
 
    // Dropdown Laporan (dashboard)
    document.getElementById('btnLaporan').addEventListener('click', function (e) {
      e.preventDefault();
      var menu = document.getElementById('dropdownLaporan');
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
 
    // Logout (dashboard)
    document.getElementById('btnLogout').addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        sessionStorage.removeItem('userLogin');
        window.location.href = 'index.html';
      }
    });
  }
 
  // ================================
  // STOK.HTML — Informasi Bahan Ajar
  // ================================
 
  if (document.getElementById('tabelStok')) {
 
    // Cek login
    var userLogin = JSON.parse(sessionStorage.getItem('userLogin'));
    if (!userLogin) window.location.href = 'index.html';
 
    // Sembunyikan tombol tambah jika bukan Administrator
    if (userLogin.role !== 'Administrator') {
      document.getElementById('btnTambah').style.display = 'none';
    }
 
    // Dropdown & logout (stok)
    document.getElementById('btnLaporan').addEventListener('click', function (e) {
      e.preventDefault();
      var menu = document.getElementById('dropdownLaporan');
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
 
    document.getElementById('btnLogout').addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        sessionStorage.removeItem('userLogin');
        window.location.href = 'index.html';
      }
    });
 
    // Render tabel
    window.renderTabel = function (data) {
      var tbody = document.getElementById('isiTabel');
      tbody.innerHTML = '';
      data.forEach(function (item, index) {
        var baris = document.createElement('tr');
        baris.innerHTML =
          '<td>' + (index + 1) + '</td>' +
          '<td><img src="' + item.cover + '" alt="' + item.namaBarang + '" style="width:60px; height:80px; object-fit:cover; border-radius:6px;"></td>' +
          '<td>' + item.kodeLokasi + '</td>' +
          '<td>' + item.kodeBarang + '</td>' +
          '<td>' + item.namaBarang + '</td>' +
          '<td>' + item.jenisBarang + '</td>' +
          '<td>' + item.edisi + '</td>' +
          '<td class="' + (item.stok < 50 ? 'stok-rendah' : 'stok-aman') + '">' + item.stok + '</td>' +
          '<td><button onclick="lihatDetail(' + index + ')" style="background:var(--biru-ut);color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px;">Detail</button></td>';
        tbody.appendChild(baris);
      });
    };
 
    renderTabel(dataBahanAjar);
 
    // Fungsi lihat detail (dipanggil dari onclick di HTML)
    window.lihatDetail = function (index) {
      var item = dataBahanAjar[index];
      document.getElementById('detailCover').src              = item.cover;
      document.getElementById('detailCover').alt              = item.namaBarang;
      document.getElementById('detailKodeLokasi').textContent = item.kodeLokasi;
      document.getElementById('detailKodeBarang').textContent = item.kodeBarang;
      document.getElementById('detailNamaBarang').textContent = item.namaBarang;
      document.getElementById('detailJenis').textContent      = item.jenisBarang;
      document.getElementById('detailEdisi').textContent      = item.edisi;
      document.getElementById('detailStok').textContent       = item.stok;
      bukaModal('modalDetail');
    };
 
    // Tambah stok
    document.getElementById('btnTambah').addEventListener('click', function () {
      document.getElementById('formTambah').style.display = 'block';
    });
 
    document.getElementById('btnBatal').addEventListener('click', function () {
      document.getElementById('formTambah').style.display = 'none';
    });
 
    document.getElementById('btnSimpan').addEventListener('click', function () {
      var lokasi = document.getElementById('addLokasi').value.trim();
      var kode   = document.getElementById('addKode').value.trim();
      var nama   = document.getElementById('addNama').value.trim();
      var jenis  = document.getElementById('addJenis').value;
      var edisi  = document.getElementById('addEdisi').value.trim();
      var stok   = document.getElementById('addStok').value;
 
      if (!lokasi || !kode || !nama || !edisi || !stok) {
        alert('Semua field wajib diisi!');
        return;
      }
 
      dataBahanAjar.push({
        kodeLokasi:  lokasi,
        kodeBarang:  kode,
        namaBarang:  nama,
        jenisBarang: jenis,
        edisi:       edisi,
        stok:        parseInt(stok),
        cover:       ''
      });
 
      renderTabel(dataBahanAjar);
 
      document.getElementById('addLokasi').value = '';
      document.getElementById('addKode').value   = '';
      document.getElementById('addNama').value   = '';
      document.getElementById('addEdisi').value  = '';
      document.getElementById('addStok').value   = '';
      document.getElementById('formTambah').style.display = 'none';
 
      alert('Stok baru berhasil ditambahkan!');
    });
 
    // Filter pencarian
    var inputCari = document.getElementById('inputCari');
    if (inputCari) {
      inputCari.addEventListener('input', function () {
        var keyword  = this.value.toLowerCase();
        var filtered = dataBahanAjar.filter(function (item) {
          return item.namaBarang.toLowerCase().includes(keyword) ||
                 item.kodeBarang.toLowerCase().includes(keyword);
        });
        renderTabel(filtered);
      });
    }
  }
 
  // ================================
  // TRACKING.HTML
  // ================================
 
  if (document.getElementById('inputDO')) {
 
    // Cek login
    var userLogin = JSON.parse(sessionStorage.getItem('userLogin'));
    if (!userLogin) window.location.href = 'index.html';
 
    // Dropdown & logout (tracking)
    document.getElementById('btnLaporan').addEventListener('click', function (e) {
      e.preventDefault();
      var menu = document.getElementById('dropdownLaporan');
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
 
    document.getElementById('btnLogout').addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        sessionStorage.removeItem('userLogin');
        window.location.href = 'index.html';
      }
    });
 
    // Fungsi cari DO
    function cariDO() {
      var noDO = document.getElementById('inputDO').value.trim();
 
      document.getElementById('hasil-tracking').style.display  = 'none';
      document.getElementById('tidak-ditemukan').style.display = 'none';
 
      if (!noDO) {
        alert('Masukkan Nomor DO terlebih dahulu!');
        return;
      }
 
      var data = dataTracking[noDO];
 
      if (!data) {
        document.getElementById('noDOGagal').textContent       = noDO;
        document.getElementById('tidak-ditemukan').style.display = 'block';
        return;
      }
 
      // Isi data
      document.getElementById('namaMahasiswa').textContent = data.nama;
      document.getElementById('nomorDO').textContent       = 'No. DO: ' + data.nomorDO;
 
      // Status badge
      var badge = document.getElementById('status-badge');
      badge.textContent = data.status;
      badge.className   = '';
      if (data.status === 'Dikirim')           badge.style.background = '#27ae60';
      else if (data.status === 'Dalam Perjalanan') badge.style.background = '#f39c12';
      else                                     badge.style.background = '#2980b9';
 
      // Progress bar
      var persen = data.status === 'Dikirim' ? 100 :
                   data.status === 'Dalam Perjalanan' ? 60 : 30;
      document.getElementById('progress-persen').textContent = persen + '%';
      document.getElementById('progress-bar').style.width    = persen + '%';
      document.getElementById('progress-bar').style.background =
        persen === 100 ? '#27ae60' : persen >= 60 ? '#f39c12' : '#2980b9';
 
      // Detail
      document.getElementById('detailEkspedisi').textContent = data.ekspedisi;
      document.getElementById('detailTanggal').textContent   = data.tanggalKirim;
      document.getElementById('detailPaket').textContent     = data.paket;
      document.getElementById('detailTotal').textContent     = data.total;
 
      // Timeline
      var list = document.getElementById('listPerjalanan');
      list.innerHTML = '';
      data.perjalanan.forEach(function (p, i) {
        var li = document.createElement('li');
        li.innerHTML =
          '<div class="tl-dot"></div>' +
          '<div class="tl-info">' +
            '<span class="tl-waktu">' + p.waktu + '</span>' +
            '<span class="tl-keterangan">' + p.keterangan + '</span>' +
          '</div>';
        li.className = i === data.perjalanan.length - 1 ? 'tl-item tl-aktif' : 'tl-item tl-selesai';
        list.appendChild(li);
      });
 
      document.getElementById('hasil-tracking').style.display = 'block';
    }
 
    document.getElementById('btnCari').addEventListener('click', function () {
      cariDO();
    });
 
    document.getElementById('inputDO').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') cariDO();
    });
  }
 
  // ================================
  // Tutup dropdown saat klik di luar (semua halaman)
  // ================================
  document.addEventListener('click', function (e) {
    var dropdown   = document.getElementById('dropdownLaporan');
    var btnLaporan = document.getElementById('btnLaporan');
    if (dropdown && btnLaporan) {
      if (!btnLaporan.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }
  });
 
});
 