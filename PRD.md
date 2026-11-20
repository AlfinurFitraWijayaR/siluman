# Product Requirements Document (PRD) — SILUMAN

| Field         | Nilai                                                                          |
| ------------- | ------------------------------------------------------------------------------ |
| Nama sistem   | Sistem Informasi Layanan untuk Manajemen Absensi dan Nilai (SILUMAN)           |
| Lokasi        | SSB Mundinglaya, Desa Sukasari Kidul, Kecamatan Argapura, Kabupaten Majalengka |
| Versi dokumen | 1.0                                                                            |
| Status        | Disetujui untuk menjadi acuan pengembangan                                     |

---

## 1. Overview Singkat

SILUMAN adalah aplikasi web terpusat untuk menggantikan pencatatan manual data siswa, absensi, dan raport perkembangan di SSB Mundinglaya. Saat ini data tersebar pada map berkas fisik, kertas absensi, dan berkas Microsoft Excel. Kondisi itu menyebabkan pencarian data lambat, rekap kehadiran terlambat, riwayat penilaian sulit ditelusuri, serta pelatih harus meminta data siswa kepada administrator setiap kali menyusun raport.

Sistem menyatukan seluruh data ke dalam satu basis data dan membatasi akses berdasarkan dua peran:

- **Administrator** mengelola data master siswa, kelas usia, data pelatih, tahun akademik, dan memverifikasi kelengkapan berkas siswa.
- **Pelatih** mencatat absensi per sesi latihan, mengisi penilaian raport per semester, serta melihat rekap kehadiran dan raport perkembangan siswa.

**Tujuan utama:** mempercepat rekapitulasi data, meminimalisasi kesalahan pencatatan, dan menyediakan rekam jejak perkembangan siswa yang dapat dipantau langsung oleh pengelola.

**Ruang lingkup:** pengelolaan data siswa, pencatatan absensi, pengisian raport penilaian perkembangan siswa, dan pengelolaan data master pendukung. Sistem tidak mencakup pembayaran iuran, pengelolaan peralatan, portal orang tua/siswa, notifikasi WhatsApp/email, pemeliharaan pasca-KP.

**Indikator keberhasilan:** seluruh delapan kebutuhan fungsional (F1-F8) terpenuhi; administrator dan pelatih dapat mengakses data yang sama tanpa permintaan manual; rekap absensi dan raport tampil < 3 detik sesuai periode yang dipilih; waktu input absensi satu kelas usia kurang lebih 2 menit; 100% raport semester tersimpan sebagai arsip digital yang dapat dilihat ulang pelatih; seluruh skenario pengujian black box lulus; antarmuka dapat dipakai pada laptop dan ponsel.

---

## 2. Core Features

| Kode | Fitur                                                    | Pengguna               | Prioritas |
| ---- | -------------------------------------------------------- | ---------------------- | --------- |
| F1   | Login/logout dan pembatasan hak akses sesuai peran       | Administrator, Pelatih | Tinggi    |
| F2   | Mengelola data siswa (tambah, ubah, hapus, lihat detail) | Administrator          | Tinggi    |
| F3   | Memverifikasi kelengkapan berkas siswa                   | Administrator          | Tinggi    |
| F4   | Mengelola kelas usia, data pelatih, dan tahun akademik   | Administrator          | Tinggi    |
| F5   | Menginput absensi siswa per kelas usia                   | Pelatih                | Tinggi    |
| F6   | Menginput penilaian raport siswa per semester            | Pelatih                | Tinggi    |
| F7   | Menampilkan rekap kehadiran siswa per periode            | Pelatih                | Tinggi    |
| F8   | Menampilkan raport kemajuan siswa per semester           | Pelatih                | Tinggi    |
| F9   | Dashboard per peran                                      | Administrator, Pelatih | Should    |
| F10  | Export raport ke PDF                                     | Pelatih                | Should    |

### 2.1 Autentikasi dan Hak Akses (F1)

- Pengguna memasukkan username dan password pada halaman login.
- Sistem mencocokkan kredensial ke basis data dan membuat sesi sesuai `role`.
- Kredensial tidak valid menampilkan pesan error; kredensial valid mengarahkan ke dashboard peran.
- Password disimpan dalam bentuk hash. Rute admin tidak dapat diakses pelatih dan sebaliknya.

### 2.2 Pengelolaan Data Siswa dan Verifikasi Berkas (F2, F3)

- Administrator melihat daftar siswa, detail siswa, serta form tambah dan ubah data.
- Data siswa meliputi NIS (gunakan format MDL-(duadigitbelakangtahunkelahiran)(nomorurut), cth: MDL16001), nama, tempat dan tanggal lahir, alamat, tanggal bergabung, status, foto profil, nama orang tua, telepon, dan posisi pemain.
- Berkas pendaftaran yang diverifikasi: formulir pendaftaran, Kartu Keluarga, akta kelahiran, pas foto, beserta status dan catatan verifikasi.
- Perubahan status siswa dan penghapusan data melalui konfirmasi.

### 2.3 Data Master (F4)

- **Kelas usia:** nama kelas (U-10 sampai U-17), status, catatan.
- **Data pelatih:** profil yang terhubung ke akun pengguna, tempat dan tanggal lahir, alamat, serta lisensi pelatih.
- **Tahun akademik:** nama periode, tanggal mulai, tanggal akhir, dan penanda periode aktif.

### 2.4 Input dan Rekap Absensi (F5, F7)

- Pelatih memilih kelas usia; sistem menampilkan daftar siswa pada kelas tersebut.
- Pelatih menetapkan status kehadiran tiap siswa untuk sesi latihan berjalan dan menyimpan.
- Sistem menolak duplikat kehadiran untuk satu siswa pada satu sesi latihan yang sama.
- Rekap absensi difilter berdasarkan kelas usia atau periode bulan; data tidak tersedia menampilkan informasi "data tidak ditemukan".

### 2.5 Input dan Rekap Raport Perkembangan (F6, F8)

- Pelatih memilih siswa, mengisi nilai per aspek penilaian, dan menambahkan catatan perkembangan.
- Data belum lengkap disimpan sebagai **Draft**; data lengkap disimpan sebagai raport final.
- Penilaian dilakukan per semester (setiap enam bulan).
- Rekap raport difilter berdasarkan periode semester; pelatih memilih nama siswa untuk melihat detail.
- Raport menampilkan data siswa, nilai tiap aspek, total nilai, catatan, serta visualisasi perkembangan kemampuan siswa antarperiode.

---

## 3. User Flow

### 3.1 Alur Login dan Pembagian Peran

```flowchart TD
    A[Buka aplikasi] --> B[Halaman login]
    B --> C[Input username dan password]
    C --> D[Tekan tombol Login]
    D --> E{Kredensial valid?}
    E -- Tidak --> F[Tampil pesan error]
    F --> B
    E -- Ya --> G[Buat sesi sesuai role]
    G --> H{Role pengguna}
    H -- Administrator --> I[Dashboard Administrator]
    H -- Pelatih --> J[Dashboard Pelatih]
```

### 3.2 Alur Administrator

```flowchart TD
    A[Dashboard Administrator] --> B[Data Siswa]
    A --> C[Kelas Usia]
    A --> D[Data Pelatih]
    A --> E[Tahun Akademik]

    B --> B1[Pilih tambah / ubah / hapus]
    B1 --> B2[Isi form data siswa]
    B2 --> B3{Data valid?}
    B3 -->|s21| B4[Tampil pesan error]
    B4 --> B2
    B3 -->|s22| B5[Simpan ke basis data]
    B --> B6[Verifikasi berkas siswa]
    B6 --> B7{Berkas lengkap?}
    B7 -->|s23| B8[Catat kekurangan pada notes]
    B7 -->|s24| B9[Ubah status terverifikasi]

    C --> C1[Tambah / ubah / hapus kelas usia]
    D --> D1[Tambah / ubah / hapus pelatih]
    E --> E1[Tambah / ubah tahun akademik]
    C1 --> F{Proses berhasil?}
    D1 --> F
    E1 --> F
    B5 --> F
    F -->|s25| G[Perbarui tampilan dan notifikasi sukses]
    F -->|s26| H[Tampil pesan error]
```

### 3.3 Alur Pelatih - Absensi

```flowchart TD
    A[Dashboard Pelatih] --> B[Buka menu Absensi]
    B --> C[Pilih kelas usia]
    C --> D[Sistem menampilkan daftar siswa]
    D --> E[Isi status kehadiran tiap siswa]
    E --> F[Tekan Simpan]
    F --> G{Data absensi valid?}
    G -->|s17| H[Tampil pesan error]
    H --> E
    G -->|s18| I[Simpan ke basis data]
    I --> J[Notifikasi penyimpanan berhasil]

    A --> K[Buka menu Rekap Absensi]
    K --> L[Pilih kelas usia atau periode bulan]
    L --> M[Tekan Tampilkan]
    M --> N{Data tersedia?}
    N -->|s19| O[Informasi: data absensi tidak ditemukan]
    N -->|s20| P[Tampilkan rekap kehadiran]
```

### 3.4 Alur Pelatih Raport Perkembangan

```flowchart TD
    A[Dashboard Pelatih] --> B[Buka menu Rapor Siswa]
    B --> C[Sistem menampilkan daftar siswa]
    C --> D[Pilih salah satu siswa]
    D --> E[Isi nilai per aspek penilaian]
    E --> F[Tambahkan catatan perkembangan]
    F --> G[Tekan Simpan]
    G --> H{Data lengkap?}
    H -- Tidak --> I[Simpan sebagai Draft]
    H -- Ya --> J[Simpan sebagai raport final]
    I --> K[Notifikasi berhasil]
    J --> K

    A --> L[Buka menu Rekap Rapor]
    L --> M[Pilih periode semester]
    M --> N[Tekan Tampilkan]
    N --> O[Tampilkan daftar raport]
    O --> P[Pilih nama siswa]
    P --> Q[Tampilkan detail raport dan grafik perkembangan]
```

### 3.7 Use Case

```flowchart LR
    Admin((Administrator))
    Pelatih((Pelatih))
    subgraph SILUMAN
        UC1([Login])
        UC2([Kelola Data Siswa])
        UC3([Kelola Kelas Usia])
        UC4([Kelola Data Pelatih])
        UC5([Kelola Tahun Akademik])
        UC6([Input Absensi])
        UC7([Rekap Absensi])
        UC8([Input Raport Perkembangan])
        UC9([Rekap Raport Perkembangan])
    end
    Admin --- UC1
    Admin --- UC2
    Admin --- UC3
    Admin --- UC4
    Admin --- UC5
    Pelatih --- UC1
    Pelatih --- UC6
    Pelatih --- UC7
    Pelatih --- UC8
    Pelatih --- UC9
```

---

## 4. Architecture

### 4.1 Stack Teknologi

| Lapisan         | Teknologi                          | Fungsi                                                                  |
| --------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| Antarmuka       | Next.js, TypeScript, React         | Halaman web, routing berbasis berkas, shared layout, tampilan responsif |
| Logika aplikasi | Next.js API Routes / Route Handler | Memproses permintaan, validasi, kontrol hak akses, mengelola sesi       |
| Akses data      | Prisma ORM                         | Pemetaan tabel ke objek, kueri aman, migrasi skema                      |
| Basis data      | PostgreSQL                         | Penyimpanan terpusat seluruh data SILUMAN                               |
| Pengujian       | Google Chrome, smartphone Android  | Uji fungsi dan tampilan responsif                                       |
| Version control | Git, GitHub                        | Pengelolaan versi kode                                                  |

### 4.2 Diagram Arsitektur

```flowchart TB
    subgraph Client["Client (Browser - Laptop / Ponsel)"]
        UI["UI Pages (Next.js / React)<br/>Admin & Pelatih"]
    end
    subgraph Server["Next.js Server"]
        MW["Middleware Auth & RBAC"]
        SSR["Server-Side Rendering + Shared Layout"]
        API["Route Handlers / API Routes<br/>(Controller Layer)"]
        SVC["Service / Business Logic<br/>Validasi, Rekap, Kalkulasi Raport"]
        ORM["Prisma ORM"]
    end
    subgraph Data["Data Layer"]
        DB[("PostgreSQL")]
    end
    UI -- HTTPS request --> MW
    MW --> SSR
    MW --> API
    API --> SVC --> ORM --> DB
    SSR --> API
    SSR -- HTML/JSON response --> UI
```

### 4.3 Struktur Modul (sementara)

| Modul       | Entity                                                | Controller (fungsi utama dari sequence diagram)                                              |
| ----------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Autentikasi | users, sessions                                       | login(), logout(), isExpired()                                                               |
| Kesiswaan   | students, student_documents                           | getStudents(), saveStudent(), updateStudent(), deleteStudent(), verify()                     |
| Master data | age_groups, academic, coaches                         | getClasses(), saveClass(), getCoaches(), saveCoach(), getYearAcademics(), saveAcademicYear() |
| Absensi     | training_sessions, attendances                        | createAttendance(), getAttendancebyPeriode(), getRecapPresent()                              |
| Penilaian   | report_cards, report_card_details, assessment_aspects | saveReportById(), getReportByPeriode(), calculateTotal(), generatePDF()                      |

---

## 5. Design & Technical Constraints

### 5.1 Kebutuhan Non-Fungsional

| Kategori            | Persyaratan                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Usability**       | Antarmuka sederhana dan informatif; mudah dipakai pengguna dengan literasi teknologi beragam                                            |
| **Responsif**       | Mobile-first untuk halaman pelatih (absensi di lapangan); desktop untuk administrator                                                   |
| **Keamanan**        | Autentikasi, RBAC, password di-hash, sesi dengan masa kedaluwarsa, proteksi SQL Injection via Prisma, validasi input sisi server, HTTPS |
| **Integritas data** | Data terpusat satu database, foreign key & unique constraint, konfirmasi sebelum hapus                                                  |
| **Performa**        | Halaman utama < 3 detik pada koneksi 4G; rekap < 3 detik; memanfaatkan SSR dan automatic code splitting                                 |
| **Ketersediaan**    | Dapat diakses kapan saja via browser selama ada internet                                                                                |
| **Skalabilitas**    | Mampu menampung pertumbuhan siswa (dari 13 → ±110 dalam < 2 tahun)                                                                      |
| **Kompatibilitas**  | Browser modern (Chrome, Safari, Microsoft Egde, dll.) pada Windows dan Android atau Mac dan iPhone                                      |
| **Maintainability** | Kode modular (TypeScript), version control Git, dokumentasi panduan singkat                                                             |
| **Backup**          | Backup database terjadwal (rekomendasi: mingguan)                                                                                       |

### 5.2 Constraint Desain

- Dua peran pengguna saja: Administrator dan Pelatih. Tidak ada peran siswa, orang tua, atau manager di sistem.
- Navigasi dan tampilan dasar seragam di seluruh halaman melalui shared layout.
- Halaman utama: login, dashboard administrator, data siswa, detail siswa, tambah siswa, data pelatih, tambah pelatih, detail pelatih, kelas usia, tahun akademik, dashboard pelatih, data siswa pelatih, detail siswa pelatih, absensi, input absensi, rekap absensi, rapor perkembangan siswa, input rapor, detail rapor.
- Raport tidak hanya menampilkan nilai, tetapi memvisualisasikan perkembangan kemampuan siswa.
- Konfirmasi wajib muncul sebelum penghapusan data.
- Satu siswa tidak boleh memiliki dua catatan absensi pada sesi latihan yang sama (unique constraint).
- Raport dinilai per semester (±6 bulan); raport tidak lengkap disimpan sebagai Draft.
- Kegiatan latihan 3×/minggu (Selasa, Kamis, Minggu) → volume absensi ±110 siswa × 3 sesi/minggu.

### 5.3 Constraint Teknis

- Framework wajib Next.js dengan bahasa TypeScript; tidak direncanakan perpindahan framework.
- Basis data wajib relasional dan diakses melalui Prisma ORM untuk mengurangi kesalahan kueri serta mencegah SQL Injection.
- Struktur basis data mengikuti class diagram pada Gambar 4.20; perubahan skema disertai migrasi Prisma.
- Field `id` primary key, foreign key, dan timestamp ditambahkan pada implementasi relasional.
- Pengujian menggunakan black box testing dan evaluasi bersama pihak SSB.
- Data uji awal: 10 siswa contoh yang tersebar pada lima kelas usia.

### 5.4 Di Luar Lingkup (Non-Goals)

- Pembayaran iuran per sesi dan iuran bulanan.
- Pengelolaan peralatan latihan dan dokumentasi kegiatan atau med sosial.
- Pendaftaran siswa baru mandiri oleh orang tua.
- Pengelolaan jadwal pertandingan dan turnamen.
- Tahap pemeliharaan sistem setelah masa kerja praktek berakhir.

### 5.5 Status Lainnya (Sementara)

- Status absensi hanya: `Hadir` dan `Alpa`.
- Posisi pemain/siswa: `Kiper`, `Belakang`, `Tengah`, `Depan`.
- Kategori aspek penilaian siswa: **Teknik**, **Fisik**, **Taktik**, **Karakter**. Kategori **Teknik**, **Fisik**, dan **Taktik** pada posisi `kiper` dibedakan.
- Aspek penilaian **Teknik**: `Passing`, `Kontrol/first touch`, `Dribbling`, `Shooting`, `Long passing`.
- Aspek penilaian **Fisik**: `Daya tahan`, `Kelincahan`, `Fleksibilitas`, `Kecepatan`.
- Aspek penilaian **Taktik**: `Menyerang`, `Bertahan`, `Transisi`.
- Aspek penilaian **Karakter**: `Sikap`, `Disiplin`, `Tanggung jawab`, `Kerjasama`, `Komunikasi`.
- Aspek penilaian **Teknik** pada posisi **kiper**: `Menangkap bola`, `Menepis & meninju bola`, `Menjatuhkan badan`, `Distribusi bola`, `Duel satu lawan satu`.
- Aspek penilaian **Fisik** pada posisi **kiper**: `Refleks`, `Kelincahan`, `Fleksibilitas`, `Kecepatan`.
- Aspek penilaian **Taktik** pada posisi **kiper**: `Positioning`, `Build-up`, `Crosses control`.

---

## 6. Entity Relationship Diagram (ERD)

```erDiagram
    USERS ||--o{ SESSIONS : "mencatat sesi login"
    USERS ||--o{ COACHES : "memiliki profil pelatih"
    STUDENTS ||--o{ STUDENT_DOCUMENTS : "memiliki berkas pendaftaran"
    AGE_GROUPS ||--o{ STUDENTS : "mengelompokkan siswa"
    AGE_GROUPS ||--o{ TRAINING_SESSIONS : "menjadwalkan sesi"
    ACADEMIC ||--o{ TRAINING_SESSIONS : "menaungi sesi"
    COACHES ||--o{ TRAINING_SESSIONS : "memimpin sesi"
    TRAINING_SESSIONS ||--o{ ATTENDANCES : "mencatat kehadiran"
    STUDENTS ||--o{ ATTENDANCES : "berstatus hadir"
    STUDENTS ||--o{ REPORT_CARDS : "dinilai perkembangannya"
    AGE_GROUPS ||--o{ REPORT_CARDS : "melengkapi data raport"
    ACADEMIC ||--o{ REPORT_CARDS : "menentukan periode"
    COACHES ||--o{ REPORT_CARDS : "menyusun raport"
    REPORT_CARDS ||--o{ REPORT_CARD_DETAILS : "memuat rincian nilai"
    ASSESSMENT_ASPECTS ||--o{ REPORT_CARD_DETAILS : "menjadi acuan penilaian"

    USERS {
        int id PK
        varchar username
        varchar email
        varchar password "hash"
        enum role "administrator|pelatih"
        varchar phone
    }

    SESSIONS {
        int id PK
        int user_id FK
        varchar ip_address
        varchar user_agent
        timestamp expired_at
    }

    COACHES {
        int id PK
        int user_id FK
        varchar place_of_birth
        date date_of_birth
        text address
        varchar license
    }

    STUDENTS {
        varchar nis PK
        varchar name
        varchar place_of_birth
        date date_of_birth
        text address
        date join_date
        enum status "aktif|nonaktif"
        varchar profile_photo
        varchar parent_name
        varchar phone
        varchar position
        int age_group_id FK
    }

    STUDENT_DOCUMENTS {
        int id PK
        varchar nis FK
        varchar registration_form
        varchar family_card
        varchar birth_certificate
        varchar pas_photo
        enum status "belum_lengkap|terverifikasi"
        text notes
    }

    AGE_GROUPS {
        int id PK
        varchar name "U-10 s.d. U-17"
        enum status "aktif|nonaktif"
        text notes
    }

    ACADEMIC {
        int id PK
        varchar name
        date periode_start
        date periode_end
    }

    TRAINING_SESSIONS {
        int id PK
        int age_group_id FK
        int academic_id FK
        int coach_id FK
        date date
    }

    ATTENDANCES {
        int id PK
        int training_session_id FK
        varchar nis FK
        enum status "hadir|izin|sakit|alpha"
    }

    REPORT_CARDS {
        int id PK
        varchar nis FK
        int age_group_id FK
        int academic_id FK
        int coach_id FK
        decimal total_score
        text notes
        enum status "draft|final"
        timestamp generated_at
    }

    REPORT_CARD_DETAILS {
        int id PK
        int report_card_id FK
        int assessment_aspect_id FK
        decimal score
        text notes
    }

    ASSESSMENT_ASPECTS {
        int id PK
        varchar name
        int max_score
        varchar category
    }
```

### 6.1 Ringkasan Entitas

| Entitas               | Peran utama                          | Metode kunci dari class diagram                                    |
| --------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| `users`               | Kredensial dan peran akun            | `login()`, `logout()`                                              |
| `sessions`            | Riwayat sesi login                   | `isExpired()`                                                      |
| `coaches`             | Profil pelatih                       | `getTrainingSessions()`, `inputAttendance()`, `createReportCard()` |
| `students`            | Biodata siswa                        | `changeStatus()`, `getAttendances()`, `getReportCards()`           |
| `student_documents`   | Berkas administrasi pendaftaran      | `verify()`                                                         |
| `age_groups`          | Kelompok usia U-10 sampai U-17       | `getStudents()`                                                    |
| `academic`            | Periode tahun akademik               | `getActivePeriod()`                                                |
| `training_sessions`   | Jadwal sesi latihan                  | `getAttendances()`                                                 |
| `attendances`         | Catatan kehadiran per siswa per sesi | `getByStudent()`, `getRecapPresent()`                              |
| `report_cards`        | Induk raport perkembangan siswa      | `calculateTotal()`, `generatePDF()`                                |
| `report_card_details` | Rincian nilai per aspek penilaian    | —                                                                  |
| `assessment_aspects`  | Master indikator penilaian           | —                                                                  |

### 6.2 Aturan Relasi Penting

- Satu `users` memiliki banyak `sessions` dan paling banyak satu `coaches` (1:N).
- Satu `age_groups` memuat banyak `students`, banyak `training_sessions`, dan banyak `report_cards` (1:N).
- Satu `training_sessions` mengacu ke satu `age_groups`, satu `academic`, dan satu `coaches`, serta memiliki banyak `attendances` (1:N).
- `attendances` adalah tabel penghubung antara `training_sessions` dan `students`; kombinasi keduanya bersifat unik.
- Satu `report_cards` memiliki banyak `report_card_details`; setiap detail merujuk ke satu `assessment_aspects` (N:1).
- `report_cards` menghubungkan `students`, `age_groups`, `academic`, dan `coaches` untuk satu periode penilaian.
- `attendances`: **UNIQUE (training_session_id, student_id)** — mencegah siswa tercatat dua kali pada sesi yang sama.
- `report_cards`: **UNIQUE (student_id, academic_id)** — satu raport per siswa per periode semester.
- `report_card_details`: **UNIQUE (report_card_id, aspect_id)** dan `score ≤ assessment_aspects.max_score`.
- `students.nis`, `users.username`, `users.email` bersifat unik; password disimpan hash.
- `ON DELETE`: `RESTRICT` untuk master data (age_groups, academic) yang sudah dipakai; `CASCADE` untuk sessions, student_documents, dan report_card_details.
