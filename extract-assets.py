#!/usr/bin/env python3
"""
Script para extraer y organizar assets del proyecto Grupo Saturno
"""
import zipfile
import os
from pathlib import Path

# Rutas
zip_path = Path("/sessions/blissful-laughing-hawking/mnt/uploads/wetransfer_cartel-campo-l-jpg_2026-04-14_1834.zip")
assets_dir = Path(__file__).parent / "assets"

# Crear estructura de carpetas
(assets_dir / "images" / "hero").mkdir(parents=True, exist_ok=True)
(assets_dir / "images" / "planta").mkdir(parents=True, exist_ok=True)
(assets_dir / "images" / "producto").mkdir(parents=True, exist_ok=True)
(assets_dir / "videos" / "procesos").mkdir(parents=True, exist_ok=True)
(assets_dir / "videos" / "loops").mkdir(parents=True, exist_ok=True)

# Mapeo de nombres originales a nombres semánticos
rename_map = {
    "cartel campo l.JPG": ("images/hero", "hero-campo-planta.jpg"),
    "P5260006.JPG": ("images/planta", "planta-exterior-01.jpg"),
    "P5260007.JPG": ("images/planta", "planta-exterior-02.jpg"),
    "P8280012.JPG": ("images/planta", "planta-exterior-03.jpg"),
    "P8280014.JPG": ("images/planta", "planta-exterior-04.jpg"),
    "P8280016.JPG": ("images/planta", "planta-exterior-05.jpg"),
    "P8280029.JPG": ("images/planta", "planta-exterior-06.jpg"),
    "P8280054.JPG": ("images/planta", "planta-proceso-01.jpg"),
    "P8280067.JPG": ("images/planta", "planta-proceso-02.jpg"),
    "Saturno_16.JPG": ("images/producto", "producto-corte-01.jpg"),
    "Saturno_38.JPG": ("images/producto", "producto-corte-02.jpg"),
    "Saturno_71.JPG": ("images/producto", "producto-corte-03.jpg"),
    "Saturno_76.JPG": ("images/producto", "producto-corte-04.jpg"),
    "Saturno_77.JPG": ("images/producto", "producto-corte-05.jpg"),
    "Saturno HORNO.mp4": ("videos/procesos", "proceso-horno.mp4"),
    "Saturno PARRILLA.mp4": ("videos/procesos", "proceso-parrilla.mp4"),
    "Saturno SARTEN.mp4": ("videos/procesos", "proceso-sarten.mp4"),
    "Saturno loop.wmv": ("videos/loops", "saturno-loop.wmv"),
}

if not zip_path.exists():
    print(f"❌ Archivo no encontrado: {zip_path}")
    exit(1)

try:
    print(f"📦 Extrayendo {zip_path.name}...")

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        for original_name, (subdir, new_name) in rename_map.items():
            try:
                # Extraer archivo temporalmente
                data = zip_ref.read(original_name)

                # Guardar con nuevo nombre
                dest_path = assets_dir / subdir / new_name
                dest_path.write_bytes(data)

                size_mb = len(data) / (1024 * 1024)
                print(f"  ✓ {original_name:<30} → {subdir}/{new_name:<30} ({size_mb:.1f} MB)")
            except KeyError:
                print(f"  ⚠ No encontrado: {original_name}")

    print(f"\n✅ Extracción completada en: {assets_dir}")

    # Listar estructura
    print(f"\n📁 Estructura de carpetas:")
    for root, dirs, files in os.walk(assets_dir):
        level = root.replace(str(assets_dir), '').count(os.sep)
        indent = ' ' * 2 * level
        print(f'{indent}{os.path.basename(root)}/')
        sub_indent = ' ' * 2 * (level + 1)
        for file in files:
            size = Path(root) / file
            size_mb = size.stat().st_size / (1024 * 1024)
            print(f'{sub_indent}{file} ({size_mb:.1f} MB)')

except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)
