// ============================================
// dataBahanAjar.js — Data Dummy Tugas Praktik 2
// Sumber: Data dari Dosen
// ============================================

var upbjjList    = ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"];
var kategoriList = ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"];

var pengirimanList = [
  { kode: "REG", nama: "Reguler (3-5 hari)" },
  { kode: "EXP", nama: "Ekspres (1-2 hari)" }
];

var paket = [
  { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
  { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
];

var stokBahanAjar = [
  {
    kode: "EKMA4116",
    judul: "Pengantar Manajemen",
    kategori: "MK Wajib",
    upbjj: "Jakarta",
    lokasiRak: "R1-A3",
    harga: 65000,
    qty: 28,
    safety: 20,
    catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
  },
  {
    kode: "EKMA4115",
    judul: "Pengantar Akuntansi",
    kategori: "MK Wajib",
    upbjj: "Jakarta",
    lokasiRak: "R1-A4",
    harga: 60000,
    qty: 7,
    safety: 15,
    catatanHTML: "<strong>Cover baru</strong>"
  },
  {
    kode: "BIOL4201",
    judul: "Biologi Umum (Praktikum)",
    kategori: "Praktikum",
    upbjj: "Surabaya",
    lokasiRak: "R3-B2",
    harga: 80000,
    qty: 12,
    safety: 10,
    catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
  },
  {
    kode: "FISIP4001",
    judul: "Dasar-Dasar Sosiologi",
    kategori: "MK Pilihan",
    upbjj: "Makassar",
    lokasiRak: "R2-C1",
    harga: 55000,
    qty: 2,
    safety: 8,
    catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
  },
  {
    kode: "EKMA4216",
    judul: "Manajemen Keuangan",
    kategori: "MK Wajib",
    upbjj: "Surabaya",
    lokasiRak: "R1-B1",
    harga: 75000,
    qty: 0,
    safety: 10,
    catatanHTML: "<strong style='color:red'>Stok habis!</strong>"
  },
  {
    kode: "PAUD4401",
    judul: "Perkembangan Anak Usia Dini",
    kategori: "MK Pilihan",
    upbjj: "Padang",
    lokasiRak: "R2-A5",
    harga: 58000,
    qty: 45,
    safety: 20,
    catatanHTML: "Edisi revisi tersedia"
  }
];

var trackingDO = {
  "DO2025-001": {
    nomorDO: "DO2025-001",
    nim: "123456789",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "Reguler (3-5 hari)",
    tanggalKirim: "2025-08-25",
    paket: "PAKET-UT-001",
    total: 120000,
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },
      { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan Jakarta" }
    ]
  },
  "DO2025-002": {
    nomorDO: "DO2025-002",
    nim: "987654321",
    nama: "Agus Pranoto",
    status: "Dikirim",
    ekspedisi: "Ekspres (1-2 hari)",
    tanggalKirim: "2025-08-26",
    paket: "PAKET-UT-002",
    total: 140000,
    perjalanan: [
      { waktu: "2025-08-26 09:00:00", keterangan: "Penerimaan di Loket: TANGSEL" },
      { waktu: "2025-08-26 12:15:33", keterangan: "Tiba di Hub: Kota SURABAYA" },
      { waktu: "2025-08-26 15:06:12", keterangan: "Proses antar ke alamat tujuan" },
      { waktu: "2025-08-26 19:30:00", keterangan: "Selesai Antar. Penerima: Agus Pranoto" }
    ]
  }
};
