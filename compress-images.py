from PIL import Image
from pathlib import Path

img_dir = Path('/sessions/blissful-laughing-hawking/mnt/GrupoSaturno/public/images')
total_before = 0
total_after = 0

for img_path in sorted(img_dir.rglob('*.jpg')):
    size_before = img_path.stat().st_size
    total_before += size_before

    with Image.open(img_path) as img:
        if img.mode != 'RGB':
            img = img.convert('RGB')
        w, h = img.size
        if w > 2400:
            ratio = 2400 / w
            img = img.resize((2400, int(h * ratio)), Image.LANCZOS)
        img.save(img_path, 'JPEG', quality=82, optimize=True)

    size_after = img_path.stat().st_size
    total_after += size_after
    reduction = (1 - size_after/size_before) * 100
    print(f'{img_path.name}: {size_before//1024}KB -> {size_after//1024}KB ({reduction:.0f}% menos)')

print(f'\nTotal: {total_before//1024//1024}MB -> {total_after//1024//1024}MB')
