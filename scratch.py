from PIL import Image

def get_hue(r, g, b):
    # Normalize RGB
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    mx, mn = max(r, g, b), min(r, g, b)
    df = mx - mn
    if df == 0:
        return 0
    elif mx == r:
        h = (60 * ((g - b) / df) + 360) % 360
    elif mx == g:
        h = (60 * ((b - r) / df) + 120) % 360
    else:
        h = (60 * ((r - g) / df) + 240) % 360
    return h

def get_sat(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == 0:
        return 0
    return (mx - mn) / mx

img = Image.open('hero-removebg.png').convert('RGBA')
pixels = img.load()

# Create a new blank overlay image
overlay = Image.new('RGBA', img.size, (0,0,0,0))
overlay_pixels = overlay.load()

width, height = img.size
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a > 0:
            h = get_hue(r, g, b)
            s = get_sat(r, g, b)
            # Blue/Cyan hues: roughly 170 to 260
            # Plus require some saturation so we don't grab white/gray
            if 170 <= h <= 270 and s > 0.15:
                overlay_pixels[x, y] = (r, g, b, a)
            # Also grab the white parts of the flowers which are highly bright and unsaturated
            # But wait, skin is also bright. So let's stick to blue for now.

overlay.save('clothes_overlay.png')
print("Saved clothes_overlay.png")
