from PIL import Image
import os

def get_hue(r, g, b):
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    mx, mn = max(r, g, b), min(r, g, b)
    df = mx - mn
    if df == 0: return 0
    elif mx == r: h = (60 * ((g - b) / df) + 360) % 360
    elif mx == g: h = (60 * ((b - r) / df) + 120) % 360
    else: h = (60 * ((r - g) / df) + 240) % 360
    return h

def get_sat(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == 0: return 0
    return (mx - mn) / mx

img = Image.open('profile.jpg').convert('RGBA')
pixels = img.load()

overlay = Image.new('RGBA', img.size, (0,0,0,0))
overlay_pixels = overlay.load()

width, height = img.size
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        h = get_hue(r, g, b)
        s = get_sat(r, g, b)
        if 170 <= h <= 270 and s > 0.15:
            overlay_pixels[x, y] = (r, g, b, 255)

overlay.save('about_clothes_overlay.png')
print("Saved about_clothes_overlay.png")
