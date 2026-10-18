# Pemeriksaan cepat: pastikan setiap rute (publik dan area pemilik) memberi status yang benar.
# Jalankan setelah `npm run build` dan `npm start` (localhost:3000).

$base = "http://localhost:3000"

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
    $harus = [int]$case[1]
    $keterangan = $case[2]

    try {
        $response = Invoke-WebRequest -Uri "$base$path" -UseBasicParsing -TimeoutSec 15
        $status = [int]$response.StatusCode
    } catch {
        if ($_.Exception.Response) {
            $status = [int]$_.Exception.Response.StatusCode
        } else {
            $status = -1
        }
    }

    if ($status -eq $harus) {
        $lulus++
        Write-Output ("LULUS  {0,-4} {1,-45} {2}" -f $status, $path, $keterangan)
    } else {
        $gagal++
        Write-Output ("GAGAL  {0,-4} {1,-45} {2} (diharapkan {3})" -f $status, $path, $keterangan, $harus)
    }
}

Write-Output ""
Write-Output "Ringkasan: $lulus lulus, $gagal gagal"

# Pemeriksaan isi: draft tidak boleh muncul di daftar proyek publik.
$profil = (Invoke-WebRequest -Uri "$base/u/nadia" -UseBasicParsing).Content
$adaDraft = $profil -match "Analisis Sentimen Ulasan Aplikasi"
$adaJudul = $profil -match "Dashboard Penjualan Ritel"
Write-Output "Daftar proyek Nadia memuat proyek published : $adaJudul (harus True)"
Write-Output "Daftar proyek Nadia memuat judul draft      : $adaDraft (harus False)"

# Pemeriksaan keamanan: tidak boleh ada javascript: pada tautan yang diretur.
$detail = (Invoke-WebRequest -Uri "$base/u/nadia/p/dashboard-penjualan-ritel" -UseBasicParsing).Content
Write-Output "Halaman detail memuat skema javascript:     : $($detail -match 'javascript:') (harus False)"

# Pemeriksaan area pemilik: draft harus tampil di daftar pemilik, bukan di publik.
$dashboard = (Invoke-WebRequest -Uri "$base/dashboard" -UseBasicParsing).Content
Write-Output "Daftar pemilik memuat judul draft           : $($dashboard -match 'Analisis Sentimen Ulasan Aplikasi') (harus True)"
Write-Output "Daftar pemilik memuat tautan editor         : $($dashboard -match '/dashboard/projects/dashboard-penjualan-ritel/edit') (harus True)"

# Tiga layar editor harus menunjukkan status yang sesuai.
$editorDraft = (Invoke-WebRequest -Uri "$base/dashboard/projects/analisis-sentimen-ulasan-aplikasi/edit" -UseBasicParsing).Content
Write-Output "Editor draft memuat penanda Draft            : $($editorDraft -match 'Draft') (harus True)"
Write-Output "Editor draft memuat tombol Simpan draft      : $($editorDraft -match 'Simpan draft') (harus True)"
Write-Output "Editor draft memuat checklist terbit         : $($editorDraft -match 'Checklist sebelum menerbitkan') (harus True)"

$editorTerbit = (Invoke-WebRequest -Uri "$base/dashboard/projects/dashboard-penjualan-ritel/edit" -UseBasicParsing).Content
Write-Output "Editor terbit memuat penanda Sudah terbit    : $($editorTerbit -match 'Sudah terbit') (harus True)"
Write-Output "Editor terbit memuat simpan perubahan publik : $($editorTerbit -match 'Simpan perubahan publik') (harus True)"
Write-Output "Editor terbit memuat tombol tarik publik     : $($editorTerbit -match 'Tarik dari publik') (harus True)"

$editorBaru = (Invoke-WebRequest -Uri "$base/dashboard/projects/new" -UseBasicParsing).Content
Write-Output "Editor baru memuat judul Proyek tanpa judul  : $($editorBaru -match 'Proyek tanpa judul') (harus True)"
Write-Output "Editor baru tidak memuat tombol simpan publik: $($editorBaru -match 'Simpan perubahan publik') (harus False)"
