<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Surat - {{ $surat->jenis_surat }}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 40px;
            color: #000;
        }
        /* Kop Surat */
        .kop-table {
            width: 100%;
            border-bottom: 3px double #000;
            padding-bottom: 12px;
            margin-bottom: 25px;
            border-collapse: collapse;
        }
        .kop-table td {
            vertical-align: top; /* Posisi sejajar di bagian atas */
        }
        .logo-img {
            width: 120px;
            height: auto;
            display: block;
            margin-top: -5px; /* Ditarik sedikit ke atas agar posisinya pas */
        }
        .kop-text {
            text-align: center;
            padding-right: 40px;
        }
        .kop-text h2, .kop-text h3, .kop-text p {
            margin: 2px 0;
        }
        .kop-text h2 { font-size: 15pt; font-weight: bold; }
        .kop-text h3 { font-size: 13pt; font-weight: bold; }
        .kop-text p { font-size: 10pt; }

        /* Nomor & Perihal */
        .surat-info {
            width: 100%;
            margin-bottom: 20px;
        }
        .surat-info td {
            vertical-align: top;
            padding: 2px 0;
        }

        /* Isi Surat */
        .content {
            text-align: justify;
        }
        .table-data {
            margin-left: 20px;
            margin-bottom: 15px;
            margin-top: 10px;
            width: 100%;
        }
        .table-data td {
            padding: 4px 2px;
            vertical-align: top;
        }

        /* Kotak Keperluan / Keterangan */
        .box-keperluan {
            margin: 15px 0;
            padding: 10px 15px;
            background-color: #fcfcfc;
            border-left: 3px solid #555;
            font-style: italic;
            text-align: justify;
        }

        /* Tanda Tangan */
        .ttd-container {
            float: right;
            text-align: left;
            margin-top: 40px;
            width: 280px;
        }
        .ttd-space {
            height: 75px;
        }
    </style>
</head>
<body>

    <!-- KOP SURAT STMIK BANDUNG -->
    <table class="kop-table">
        <tr>
            <td width="18%" align="left">
                <img src="{{ public_path('images/logo_stmik.png') }}" class="logo-img" alt="Logo STMIK Bandung">
            </td>
            <td width="82%" class="kop-text">
                <h2>STMIK BANDUNG</h2>
                <h3>SEKOLAH TINGGI MANAJEMEN INFORMATIKA DAN KOMPUTER BANDUNG</h3>
                <p>Jl. Cikutra No. 113, Cibeunying Kaler, Kota Bandung, Jawa Barat 40124</p>
                <p>Website: www.stmik-bandung.ac.id | Email: info@stmik-bandung.ac.id</p>
            </td>
        </tr>
    </table>

    <!-- NOMOR DAN PERIHAL SURAT -->
    <table class="surat-info">
        <tr>
            <td width="90">Nomor</td>
            <td width="10">:</td>
            <td>{{ $surat->id }}/STMIK-Bdg/BAAK/{{ date('Y') }}</td>
            <td align="right">Bandung, {{ now()->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <td>Lampiran</td>
            <td>:</td>
            <td colspan="2">1 (Satu) Berkas</td>
        </tr>
        <tr>
            <td>Perihal</td>
            <td>:</td>
            <td colspan="2"><b>Surat Keterangan / Pengantar {{ $surat->jenis_surat }}</b></td>
        </tr>
    </table>

    <!-- TUJUAN SURAT -->
    <div style="margin-top: 20px; margin-bottom: 20px;">
        Kepada Yth.<br>
        <b>{{ $surat->tujuan_surat }}</b><br>
        di Tempat
    </div>

    <!-- ISI UTAMA SURAT -->
    <div class="content">
        <p>Dengan hormat,</p>
        
        @if(stripos($surat->jenis_surat, 'Aktif') !== false)
            <p>Yang bertanda tangan di bawah ini pimpinan STMIK Bandung menerangkan dengan sebenarnya bahwa mahasiswa berikut:</p>
        @elseif(stripos($surat->jenis_surat, 'Penelitian') !== false || stripos($surat->jenis_surat, 'Riset') !== false)
            <p>Sehubungan dengan pelaksanaan riset / tugas akhir mahasiswa, maka dengan ini pimpinan STMIK Bandung memberikan izin kepada mahasiswa berikut:</p>
        @else
            <p>Yang bertanda tangan di bawah ini pimpinan STMIK Bandung menerangkan bahwa mahasiswa berikut:</p>
        @endif

        <table class="table-data">
            <tr>
                <td width="180">Nama Lengkap</td>
                <td width="10">:</td>
                <td><b>{{ $surat->user->name ?? '-' }}</b></td>
            </tr>
            <tr>
                <td width="180">Nomor Induk Mahasiswa (NIM)</td>
                <td>:</td>
                <td><b>{{ $surat->user->nim ?? '-' }}</b></td>
            </tr>
            <tr>
                <td>Program Studi</td>
                <td>:</td>
                <td><b>{{ $surat->user->prodi ?? 'Teknik Informatika / Sistem Informasi' }}</b></td>
            </tr>
        </table>

        <p>
            Mahasiswa tersebut di atas adalah benar-benar mahasiswa aktif pada STMIK Bandung yang bermaksud mengajukan permohonan <b>{{ strtolower($surat->jenis_surat) }}</b> dengan rincian keperluan sebagai berikut:
        </p>

        <div class="box-keperluan">
            "{{ $surat->keperluan }}"
        </div>

        @if(stripos($surat->jenis_surat, 'Penelitian') !== false || stripos($surat->jenis_surat, 'Riset') !== false)
            <p>
                Sehubungan dengan hal tersebut, kami mohon bantuan pihak instansi/perusahaan bapak/ibu agar dapat berkenan memberikan izin bagi mahasiswa bersangkutan untuk melaksanakan kegiatan penelitian di instansi yang dipimpin.
            </p>
        @endif

        <p>
            Demikian surat keterangan/pengantar ini dibuat dengan sebenarnya dan untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian serta kerja sama yang baik, kami ucapkan terima kasih.
        </p>
    </div>

    <!-- TANDA TANGAN WAKIL KETUA I BIDANG AKADEMIK -->
    <div class="ttd-container">
        <p>Bandung, {{ now()->translatedFormat('d F Y') }}<br>
           Wakil Ketua I Bidang Akademik,</p>
        <div class="ttd-space"></div>
        <p><b>Dr. Yus Jayusman, M.T.</b><br>
           NIDN. 0401018001</p>
    </div>

</body>
</html>