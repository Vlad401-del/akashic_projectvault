# Pemeriksaan cepat tahap 1: pastikan setiap rute memberi status yang benar.
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
    @("/u/darryl/p/dashboard-penjualan", 200, "rute contoh dari dokumen")
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
