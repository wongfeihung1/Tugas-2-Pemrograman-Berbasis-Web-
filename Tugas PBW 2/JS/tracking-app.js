// ============================================
// tracking-app.js — Vue.js untuk tracking.html
// SITTA Universitas Terbuka — Tugas Praktik 2
// ============================================

var appTracking = new Vue({
  el: '#app-tracking',

  data: {
    // Data dari dataBahanAjar.js
    pengirimanList: pengirimanList,
    paketList:      paket,

    // Data tracking
    trackingData: Object.assign({}, trackingDO),

    // State
    doAktif:        null,
    inputCari:      '',
    pesanCariGagal: '',

    // Modal form DO baru
    tampilFormDO:  false,
    formDO: {
      nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: ''
    },
    errorDO:       {},
    pesanGagalDO:  '',
    pesanSuksesDO: ''
  },

  // ============================================
  // COMPUTED
  // ============================================
  computed: {

    // Detail DO yang sedang aktif
    doDetail: function() {
      if (!this.doAktif) return null;
      return this.trackingData[this.doAktif];
    },

    // Progress pengiriman dalam persen
    progressPersen: function() {
      if (!this.doDetail) return 0;
      var map = {
        'Diproses':         25,
        'Dalam Perjalanan': 65,
        'Dikirim':         100
      };
      return map[this.doDetail.status] || 25;
    },

    // Auto-generate nomor DO: DO{tahun}-{seq}
    nomorDOBaru: function() {
      var tahun = new Date().getFullYear();
      var seq   = Object.keys(this.trackingData).length + 1;
      return 'DO' + tahun + '-' + String(seq).padStart(3, '0');
    },

    // Objek paket yang dipilih di form
    paketDipilih: function() {
      var vm = this;
      if (!vm.formDO.paket) return null;
      return vm.paketList.find(function(p) {
        return p.kode === vm.formDO.paket;
      }) || null;
    }
  },

  // ============================================
  // WATCHERS
  // ============================================
  watch: {
    // Watcher 1: Pantau DO yang sedang aktif
    doAktif: function(baru, lama) {
      if (baru) {
        console.log('[Watcher] DO aktif:', lama || '-', '→', baru);
      }
    },

    // Watcher 2: Pantau paket yang dipilih di form → log harga
    'formDO.paket': function(kode) {
      if (kode && this.paketDipilih) {
        console.log('[Watcher] Paket dipilih:', kode, '— Harga:', this.paketDipilih.harga);
      }
    },

    // Watcher 3: Reset pesan gagal saat input berubah
    inputCari: function() {
      this.pesanCariGagal = '';
    }
  },

  // ============================================
  // METHODS
  // ============================================
  methods: {

    formatRupiah: function(angka) {
      return 'Rp ' + Number(angka).toLocaleString('id-ID');
    },

    warnaStatus: function(status) {
      var map = {
        'Dikirim':          '#27ae60',
        'Dalam Perjalanan': '#e67e22',
        'Diproses':         '#2980b9'
      };
      return map[status] || '#6b7a8d';
    },

    // Cari DO berdasarkan nomor atau nama
    cariDO: function() {
      var vm   = this;
      var kata = this.inputCari.trim().toLowerCase();
      this.pesanCariGagal = '';

      if (!kata) {
        this.pesanCariGagal = 'Masukkan nomor DO atau nama mahasiswa.';
        return;
      }

      var ditemukan = Object.keys(this.trackingData).find(function(key) {
        var item = vm.trackingData[key];
        return item.nomorDO.toLowerCase().includes(kata) ||
               item.nama.toLowerCase().includes(kata);
      });

      if (ditemukan) {
        this.doAktif   = ditemukan;
        this.inputCari = '';
      } else {
        this.pesanCariGagal = 'DO "' + this.inputCari + '" tidak ditemukan.';
        this.doAktif = null;
      }
    },

    // Tutup form DO
    tutupFormDO: function() {
      this.tampilFormDO  = false;
      this.pesanGagalDO  = '';
      this.pesanSuksesDO = '';
      this.errorDO       = {};
      this.formDO = { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: '' };
    },

    // Validasi form DO
    validasiDO: function() {
      var f = this.formDO;
      var e = {};
      if (!f.nim.trim())       e.nim          = 'NIM wajib diisi.';
      if (!f.nama.trim())      e.nama         = 'Nama wajib diisi.';
      if (!f.ekspedisi)        e.ekspedisi    = 'Pilih ekspedisi.';
      if (!f.paket)            e.paket        = 'Pilih paket bahan ajar.';
      if (!f.tanggalKirim)     e.tanggalKirim = 'Tanggal kirim wajib diisi.';
      this.errorDO = e;
      return Object.keys(e).length === 0;
    },

    // Simpan DO baru
    simpanDO: function() {
      this.pesanGagalDO  = '';
      this.pesanSuksesDO = '';

      if (!this.validasiDO()) {
        this.pesanGagalDO = 'Mohon lengkapi semua field yang wajib diisi.';
        return;
      }

      var noDO  = this.nomorDOBaru;
      var harga = this.paketDipilih ? this.paketDipilih.harga : 0;
      var now   = new Date();
      var waktu = now.getFullYear() + '-' +
                  String(now.getMonth() + 1).padStart(2, '0') + '-' +
                  String(now.getDate()).padStart(2, '0') + ' ' +
                  String(now.getHours()).padStart(2, '0') + ':' +
                  String(now.getMinutes()).padStart(2, '0') + ':' +
                  String(now.getSeconds()).padStart(2, '0');

      // $set agar Vue reaktif terhadap key baru di object
      this.$set(this.trackingData, noDO, {
        nomorDO:      noDO,
        nim:          this.formDO.nim.trim(),
        nama:         this.formDO.nama.trim(),
        ekspedisi:    this.formDO.ekspedisi,
        paket:        this.formDO.paket,
        tanggalKirim: this.formDO.tanggalKirim,
        total:        harga,
        status:       'Diproses',
        perjalanan: [
          { waktu: waktu, keterangan: 'DO berhasil dibuat. Menunggu proses pengiriman oleh Universitas Terbuka.' }
        ]
      });

      this.pesanSuksesDO = noDO + ' berhasil dibuat!';
      var vm = this;
      setTimeout(function() {
        vm.doAktif = noDO;
        vm.tutupFormDO();
      }, 1500);
    }
  },

  // Set tanggal hari ini sebagai default
  created: function() {
    var now = new Date();
    this.formDO.tanggalKirim =
      now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');

    // Tampilkan DO pertama otomatis jika ada
    var keys = Object.keys(this.trackingData);
    if (keys.length > 0) this.doAktif = keys[0];
  }
});
