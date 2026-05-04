from PIL import Image

def remove_white_bg(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # to transparent
            r, g, b, a = item
            # Calculate distance from pure white
            # using simple luminance or average
            avg = (r + g + b) / 3
            if avg > 240:
                # Make it transparent
                # Smooth blending based on how close to white it is
                alpha = int(255 * (255 - avg) / 15.0)
                newData.append((r, g, b, max(0, alpha)))
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Processed {input_path}")
    except Exception as e:
        print(f"Failed to process {input_path}: {e}")

remove_white_bg("sapphire_bloom.png", "sapphire_bloom.png")
