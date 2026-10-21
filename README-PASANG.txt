YOWDRINK — REVISI OPEN GRAPH IMAGE (og:image)

Isi ZIP:
- og-image.png : gambar thumbnail 1200 x 630 untuk preview saat link dibagikan.
- META-TAGS-OG.txt : tag metadata yang perlu ditambahkan ke <head> index.html.

CARA PASANG (repo thaniaaulia/yowdrink):
1. Upload og-image.png ke ROOT repository, sejajar dengan index.html (jangan taruh di folder css/js).
2. Buka index.html di GitHub lalu klik Edit (ikon pensil).
3. Di dalam <head>, setelah meta description, tempel semua isi META-TAGS-OG.txt.
4. Commit changes. Tunggu GitHub Pages / hosting selesai deploy.
5. Cek gambar langsung: https://yowdrink.nnthan.my.id/og-image.png
   Kalau gambarnya tampil, lalu cek halaman dengan https://opengraphimage.com/inspect atau https://ogimage.io/preview.

PENTING:
- Jangan mengganti index.html dengan file META-TAGS-OG.txt. File tersebut hanya potongan metadata untuk ditempel ke index.html yang sudah ada.
- ZIP ini tidak mengubah repository secara otomatis. Perubahan baru aktif setelah file diunggah dan metadata ditambahkan.
- WhatsApp dan platform sosial bisa menyimpan cache preview lama. Setelah deploy, coba bagikan URL dengan query seperti https://yowdrink.nnthan.my.id/?v=2 atau gunakan alat pemeriksa Open Graph untuk meminta pembacaan ulang.
- Thumbnail otomatis tidak bisa dijamin di semua platform, tetapi tag OG dan gambar publik ini adalah pengaturan standar untuk mendukung preview.
