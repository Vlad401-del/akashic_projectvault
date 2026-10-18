# Pemeriksaan cepat: pastikan setiap rute (publik dan area pemilik) memberi status yang benar.
# Jalankan setelah `npm run build` dan `npm start` (localhost:3000).

$base = "http://localhost:3000"

# Penghitung hasil dan dua penolong pencetakan, dipakai oleh seluruh pemeriksaan
# di bawah supaya ringkasannya tunggal dan jujur.
$lulus = 0
$gagal = 0

function Tulis-Hasil([int]$kode, [int]$harus, [string]$path, [string]$keterangan) {
    if ($kode -eq $harus) {
        $script:lulus++
        Write-Output ("LULUS  {0,-4} {1,-45} {2}" -f $kode, $path, $keterangan)
    } else {
        $script:gagal++
        Write-Output ("GAGAL  {0,-4} {1,-45} {2} (diharapkan {3})" -f $kode, $path, $keterangan, $harus)
    }
}

function Tulis-Cek([bool]$hasil, [string]$keterangan) {
    if ($hasil) {
        $script:lulus++
        Write-Output "LULUS  isi    $keterangan"
    } else {
        $script:gagal++
        Write-Output "GAGAL  isi    $keterangan"
    }
}

function Ambil-Status([string]$path) {
    try {
        return [int](Invoke-WebRequest -Uri "$base$path" -UseBasicParsing -TimeoutSec 15).StatusCode
    } catch {
        if ($_.Exception.Response) {
            return [int]$_.Exception.Response.StatusCode
        }

        return -1
    }
}

# Tunggu server siap (maksimum 60 detik) sebelum memeriksa rute.
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
    try {
        $null = Invoke-WebRequest -Uri "$base/" -UseBasicParsing -TimeoutSec 3
        $ready = $true
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

if (-not $ready) {
    Write-Output "GAGAL: server tidak merespons di $base"
    exit 1
}

# [path, status yang diharapkan, keterangan]
$cases = @(
    @("/", 200, "halaman awal"),
    @("/u/nadia", 200, "profil publik Nadia"),
    @("/u/darryl", 200, "profil publik Darryl"),
    @("/u/rangga", 200, "profil tanpa proyek (empty state)"),
    @("/u/sekar", 404, "profil privat harus 404"),
    @("/u/tidak-ada", 404, "username tidak dikenal harus 404"),
    @("/u/nadia/p/dashboard-penjualan-ritel", 200, "proyek published"),
    @("/u/nadia/p/analisis-sentimen-ulasan-aplikasi", 404, "proyek draft harus 404"),
    @("/u/sekar/aplikasi-kasir-umkm", 404, "proyek milik profil privat harus 404"),
    @("/u/darryl/p/dashboard-penjualan", 200, "rute contoh dari dokumen"),
    @("/dashboard", 200, "area pemilik: daftar proyek"),
    @("/dashboard/projects/new", 200, "editor: proyek baru"),
    @("/dashboard/projects/dashboard-penjualan-ritel/edit", 200, "editor: proyek sudah terbit"),
    @("/dashboard/projects/analisis-sentimen-ulasan-aplikasi/edit", 200, "editor: proyek draft"),
    @("/dashboard/projects/tidak-ada/edit", 404, "editor: slug tidak dikenal harus 404")
)

$lulus = 0
$gagal = 0

foreach ($case in $cases) {
    $path = $case[0]
    Tulis-Hasil (Ambil-Status $path) ([int]$case[1]) $path $case[2]
}

# Pemeriksaan isi: draft tidak boleh muncul di daftar proyek publik.
$profil = (Invoke-WebRequest -Uri "$base/u/nadia" -UseBasicParsing).Content
Tulis-Cek ($profil -match "Dashboard Penjualan Ritel") "daftar proyek Nadia memuat proyek yang sudah terbit"
Tulis-Cek (-not ($profil -match "Analisis Sentimen Ulasan Aplikasi")) "daftar proyek Nadia tidak memuat draft"

# Pemeriksaan keamanan: tidak boleh ada javascript: pada tautan yang diretur.
$detail = (Invoke-WebRequest -Uri "$base/u/nadia/p/dashboard-penjualan-ritel" -UseBasicParsing).Content
Tulis-Cek (-not ($detail -match "javascript:")) "halaman detail tidak memuat skema javascript:"

# Pemeriksaan area pemilik: draft harus tampil di daftar pemilik, bukan di publik.
$dashboard = (Invoke-WebRequest -Uri "$base/dashboard" -UseBasicParsing).Content
Tulis-Cek ($dashboard -match "Analisis Sentimen Ulasan Aplikasi") "daftar pemilik memuat judul draft"
Tulis-Cek ($dashboard -match "/dashboard/projects/dashboard-penjualan-ritel/edit") "daftar pemilik memuat tautan editor"

# Tiga layar editor harus menunjukkan status dan tombol yang sesuai.
$editorDraft = (Invoke-WebRequest -Uri "$base/dashboard/projects/analisis-sentimen-ulasan-aplikasi/edit" -UseBasicParsing).Content
Tulis-Cek ($editorDraft -match ">(<!-- -->)?Draft<") "editor draft memuat penanda status Draft"
Tulis-Cek ($editorDraft -match ">(<!-- -->)?Simpan draft<") "editor draft memuat tombol Simpan draft"
Tulis-Cek ($editorDraft -match "Checklist sebelum menerbitkan") "editor draft memuat checklist terbit"

$editorTerbit = (Invoke-WebRequest -Uri "$base/dashboard/projects/dashboard-penjualan-ritel/edit" -UseBasicParsing).Content
Tulis-Cek ($editorTerbit -match ">(<!-- -->)?Sudah terbit<") "editor terbit memuat penanda status Sudah terbit"
Tulis-Cek ($editorTerbit -match ">(<!-- -->)?Simpan perubahan publik<") "editor terbit memuat tombol simpan perubahan publik"
Tulis-Cek ($editorTerbit -match ">(<!-- -->)?Tarik dari publik<") "editor terbit memuat tombol tarik dari publik"

$editorBaru = (Invoke-WebRequest -Uri "$base/dashboard/projects/new" -UseBasicParsing).Content
Tulis-Cek ($editorBaru -match ">(<!-- -->)?Proyek tanpa judul<") "editor baru memuat judul Proyek tanpa judul"
Tulis-Cek (-not ($editorBaru -match "Simpan perubahan publik")) "editor baru tidak memuat tombol simpan publik"

# ---------------------------------------------------------------------------
# Penyimpanan lokal.
#
# Bagian ini memasang berkas seed sementara di `web/.data/projects.json` supaya
# dapat dipastikan proyek hasil editor benar-benar muncul di halaman publik.
# Isi asli (bila ada) dikembalikan setelah pemeriksaan selesai, termasuk bila
# pemeriksaan gagal di tengah jalan. Cara menguji lewat formulir editor sendiri
# ada di README root, bagian "Mencoba satu tugas dari awal sampai terbit".
# ---------------------------------------------------------------------------
$dataDir = Join-Path $PSScriptRoot "..\.data"
$dataFile = Join-Path $dataDir "projects.json"
$backupFile = Join-Path $dataDir "projects.json.selagi-periksa"
$seedFile = Join-Path $PSScriptRoot "seed\proyek-uji-penyimpanan-lokal.json"

Write-Output ""

if (-not (Test-Path -LiteralPath $seedFile)) {
    Write-Output "GAGAL  seed   berkas seed tidak ditemukan: $seedFile"
    $gagal++
} else {
    $adaBerkasAsli = Test-Path -LiteralPath $dataFile

    if ($adaBerkasAsli) {
        Copy-Item -LiteralPath $dataFile -Destination $backupFile -Force
    }

    try {
        New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
        Copy-Item -LiteralPath $seedFile -Destination $dataFile -Force

        Write-Output "Penyimpanan lokal diuji dengan berkas seed:"
        Tulis-Hasil (Ambil-Status "/u/nadia/p/uji-penyimpanan-lokal") 200 "/u/nadia/p/uji-penyimpanan-lokal" "proyek hasil editor yang terbit"
        Tulis-Hasil (Ambil-Status "/u/nadia/p/uji-penyimpanan-lokal-draft") 404 "/u/nadia/p/uji-penyimpanan-lokal-draft" "proyek hasil editor yang masih draft"

        $dashboardSeed = (Invoke-WebRequest -Uri "$base/dashboard" -UseBasicParsing).Content
        Tulis-Cek ($dashboardSeed -match "Uji Penyimpanan Lokal") "daftar pemilik memuat proyek seed"

        $berandaSeed = (Invoke-WebRequest -Uri "$base/" -UseBasicParsing).Content
        Tulis-Cek ($berandaSeed -match "Uji Penyimpanan Lokal") "halaman awal memuat proyek seed"

        $profilSeed = (Invoke-WebRequest -Uri "$base/u/nadia" -UseBasicParsing).Content
        Tulis-Cek (-not ($profilSeed -match "Uji Penyimpanan Lokal Draft")) "profil publik tidak memuat draft seed"
    } finally {
        if ($adaBerkasAsli) {
            Move-Item -LiteralPath $backupFile -Destination $dataFile -Force
            Write-Output "Penyimpanan lokal dikembalikan ke isi semula."
        } else {
            Remove-Item -LiteralPath $dataFile -Force -ErrorAction SilentlyContinue
            Write-Output "Berkas penyimpanan lokal sementara sudah dihapus."
        }
    }
}

Write-Output ""
Write-Output "Ringkasan akhir: $lulus lulus, $gagal gagal"
