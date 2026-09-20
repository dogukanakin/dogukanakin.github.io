# Resume-s

This repository contains my resume in both Turkish and English.

## Portfolio site

The root `index.html` is a dependency-free static portfolio site for
[dogukanakin.github.io](https://dogukanakin.github.io). It is intentionally
built with plain HTML, CSS, and JavaScript so it can run directly on GitHub
Pages without a build step, paid service, domain, or API key.

The theme follows `prefers-color-scheme` on first load. The accessible header
toggle lets visitors choose light or dark mode, and that manual choice is
remembered in `localStorage`.

The site also includes a production-ready favicon, Apple touch icon, web
manifest, Open Graph/Twitter share metadata, canonical URL, `robots.txt`,
`sitemap.xml`, and a limited `Person` JSON-LD record. The social share image is
the local `assets/og-image.png` file; no analytics, tracking, paid service, or
API key is required.

### Run locally

From the repository root:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080> in a browser. Stop the server with `Ctrl+C`.

### Publish with GitHub Pages

The intended repository is `dogukanakin/dogukanakin.github.io`. GitHub Pages
should be configured with **Deploy from a branch**, branch **main**, and folder
**/ (root)**. After changes are committed to `main`, the site is served at
<https://dogukanakin.github.io>.

## Local LaTeX compiler

Overleaf yerine CV dosyalarını yerelde kontrol edip PDF üretmek için:

```bash
python3 cv_compile.py dogukanLatestcv.tex
python3 cv_compile.py dogukanLatestcvFrontend.tex
```

Script önce kaynak yapısını kontrol eder. Süslü parantez, environment, eksik yerel dosya ve tekrar eden paket sorunlarını raporlar. Kaynak kontrolü başarılıysa `latexmk`, `pdflatex`, `xelatex` veya `lualatex` motorlarından PATH içinde bulunan ilk uygun motorla derleme yapar.

Derleme çıktıları kaynak dosyanın yanına dağılmaz; `.cv-build/<cv-dosya-adı>/` altında tutulur. Özel motor veya çıktı yolu seçmek için:

```bash
python3 cv_compile.py dogukanLatestcv.tex --engine pdflatex
python3 cv_compile.py dogukanLatestcv.tex --output out/dogukanLatestcv.pdf
python3 cv_compile.py dogukanLatestcv.tex --build-dir /tmp/cv-build
python3 cv_compile.py dogukanLatestcv.tex --output out/dogukanLatestcv.pdf --clean
```

Makinede LaTeX motoru yoksa MacTeX gibi bir LaTeX dağıtımı kurun ve kurulumdan sonra şu komutlardan biriyle PATH durumunu kontrol edin:

```bash
command -v latexmk
command -v pdflatex
```

Overleaf'teki Computer Modern görünümüne daha yakın Type 1 font çıktısı için BasicTeX üzerinde `cm-super` paketini de kurun:

```bash
sudo tlmgr install cm-super
```

Çıkış kodları:

- `0`: PDF üretildi.
- `1`: CV kaynak veya LaTeX derleme hatası var.
- `2`: Geçersiz CLI girdisi veya yerel LaTeX motoru bulunamadı.

## Tests

LaTeX kurulumu olmadan Python standard library ile testleri çalıştırabilirsiniz:

```bash
python3 -m unittest discover -s tests -v
```

## Existing resume files

The original `.tex` files are kept unchanged by the compiler. PDF files can also be generated directly after a local LaTeX distribution is installed.
