// ============================================
// stok-app.js — Vue.js untuk stok.html
// SITTA Universitas Terbuka — Tugas Praktik 2
// ============================================

var appStok = new Vue({
  el: '#app-stok',

  data: {
    // Data dari dataBahanAjar.js
    upbjjList:    upbjjList,
    kategoriList: kategoriList,
    stok:         stokBahanAjar.map(function(item) { return Object.assign({}, item); }),

    // Filter
    cari:           '',
    filterUpbjj:    '',
    filterKategori: '',
    filterReorder:  false,

    // Sort
    sortKey: '',
    sortAsc: true,

    // Edit inline
    editIndex: null,
    editQty:   0,

    // Modal detail (dari Tugas 1)
    itemDetail: null,

    // Modal tambah baru
    tampilFormTambah: false,
    formBaru: {
      kode: '', judul: '', kategori: '', upbjj: '',
      lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: ''
    },
    errorBaru:  {},
    pesanGagal:  '',
    pesanSukses: ''
  },

  // ============================================
  // COMPUTED — cached, tidak recompute jika data tidak berubah
  // ============================================
  computed: {

    // Kategori yang tersedia di daerah terpilih (dependent options)
    kategoriDiDaerah: function() {
      if (!this.filterUpbjj) return this.kategoriList;
      var vm  = this;
      var set = {};
      this.stok.forEach(function(item) {
        if (item.upbjj === vm.filterUpbjj) set[item.kategori] = true;
      });
      return Object.keys(set);
    },

    // Jumlah item yang perlu reorder
    jumlahReorder: function() {
      return this.stok.filter(function(item) {
        return item.qty < item.safety;
      }).length;
    },

    // Data yang ditampilkan di tabel (sudah difilter + diurutkan)
    stokDitampilkan: function() {
      var vm   = this;
      var data = this.stok.slice();

      // Filter teks pencarian
      if (vm.cari) {
        var kata = vm.cari.toLowerCase();
        data = data.filter(function(item) {
          return item.judul.toLowerCase().includes(kata) ||
                 item.kode.toLowerCase().includes(kata);
        });
      }

      // Filter UT-Daerah
      if (vm.filterUpbjj) {
        data = data.filter(function(item) {
          return item.upbjj === vm.filterUpbjj;
        });
      }

      // Filter Kategori (hanya aktif jika daerah sudah dipilih — dependent)
      if (vm.filterUpbjj && vm.filterKategori) {
        data = data.filter(function(item) {
          return item.kategori === vm.filterKategori;
        });
      }

      // Filter reorder saja
      if (vm.filterReorder) {
        data = data.filter(function(item) {
          return item.qty < item.safety || item.qty === 0;
        });
      }

      // Sort
      if (vm.sortKey) {
        data.sort(function(a, b) {
          var va = a[vm.sortKey];
          var vb = b[vm.sortKey];
          if (typeof va === 'string') {
            return vm.sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
          }
          return vm.sortAsc ? va - vb : vb - va;
        });
      }

      return data;
    }
  },

  // ============================================
  // WATCHERS
  // ============================================
  watch: {
    // Watcher 1: Reset kategori saat daerah berubah
    filterUpbjj: function(baru) {
      this.filterKategori = '';
      console.log('[Watcher] UT-Daerah berubah ke:', baru || 'Semua');
    },

    // Watcher 2: Pantau jumlah reorder
    jumlahReorder: function(baru, lama) {
      if (baru !== lama) {
        console.log('[Watcher] Item reorder:', lama, '→', baru);
      }
    },

    // Watcher 3: Pantau filterReorder
    filterReorder: function(aktif) {
      console.log('[Watcher] Filter reorder:', aktif ? 'Aktif' : 'Nonaktif');
    }
  },

  // ============================================
  // METHODS
  // ============================================
  methods: {

    formatRupiah: function(angka) {
      return 'Rp ' + Number(angka).toLocaleString('id-ID');
    },

    getIndex: function(item) {
      return this.stok.indexOf(item);
    },

    resetFilter: function() {
      this.cari           = '';
      this.filterUpbjj    = '';
      this.filterKategori = '';
      this.filterReorder  = false;
      this.sortKey        = '';
      this.sortAsc        = true;
    },

    // Edit inline
    mulaiEdit: function(item) {
      this.editIndex = this.stok.indexOf(item);
      this.editQty   = item.qty;
    },

    simpanEdit: function() {
      if (this.editIndex === null) return;
      if (this.editQty < 0) { alert('Stok tidak boleh negatif!'); return; }
      this.$set(this.stok[this.editIndex], 'qty', this.editQty);
      this.editIndex = null;
    },

    batalEdit: function() {
      this.editIndex = null;
    },

    // Hapus item
    hapusItem: function(item) {
      if (confirm('Hapus bahan ajar "' + item.judul + '"?')) {
        this.stok.splice(this.stok.indexOf(item), 1);
      }
    },

    // Lihat detail (modal dari Tugas 1)
    lihatDetail: function(item) {
      this.itemDetail = item;
    },

    // Form tambah
    tutupFormTambah: function() {
      this.tampilFormTambah = false;
      this.pesanGagal  = '';
      this.pesanSukses = '';
      this.errorBaru   = {};
      this.formBaru = {
        kode: '', judul: '', kategori: '', upbjj: '',
        lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: ''
      };
    },

    validasiBaru: function() {
      var f = this.formBaru;
      var e = {};
      if (!f.kode.trim())               e.kode     = 'Kode wajib diisi.';
      if (!f.judul.trim())              e.judul    = 'Judul wajib diisi.';
      if (!f.kategori)                  e.kategori = 'Pilih kategori.';
      if (!f.upbjj)                     e.upbjj    = 'Pilih UT-Daerah.';
      if (f.harga  === '' || f.harga  < 0) e.harga  = 'Harga wajib diisi (≥ 0).';
      if (f.qty    === '' || f.qty    < 0) e.qty    = 'Stok wajib diisi (≥ 0).';
      if (f.safety === '' || f.safety < 0) e.safety = 'Safety stock wajib diisi (≥ 0).';
      this.errorBaru = e;
      return Object.keys(e).length === 0;
    },

    simpanBaru: function() {
      this.pesanGagal  = '';
      this.pesanSukses = '';

      if (!this.validasiBaru()) {
        this.pesanGagal = 'Mohon lengkapi semua field yang wajib diisi.';
        return;
      }

      // Cek duplikat kode
      var vm = this;
      var ada = this.stok.find(function(item) {
        return item.kode.toUpperCase() === vm.formBaru.kode.toUpperCase();
      });
      if (ada) {
        this.pesanGagal = 'Kode "' + this.formBaru.kode + '" sudah ada.';
        return;
      }

      this.stok.push({
        kode:        this.formBaru.kode.toUpperCase().trim(),
        judul:       this.formBaru.judul.trim(),
        kategori:    this.formBaru.kategori,
        upbjj:       this.formBaru.upbjj,
        lokasiRak:   this.formBaru.lokasiRak.trim(),
        harga:       Number(this.formBaru.harga),
        qty:         Number(this.formBaru.qty),
        safety:      Number(this.formBaru.safety),
        catatanHTML: this.formBaru.catatanHTML.trim()
      });

      this.pesanSukses = 'Bahan ajar berhasil ditambahkan!';
      var vm2 = this;
      setTimeout(function() { vm2.tutupFormTambah(); }, 1500);
    }
  }
});
