import os

def update_readme():
    readme_path = "../README.md"
    if not os.path.exists(readme_path):
        print("README.md not found")
        return

    # Try different encodings
    encodings = ['utf-16le', 'utf-8', 'latin-1']
    content = None
    used_encoding = None
    
    for enc in encodings:
        try:
            with open(readme_path, 'r', encoding=enc) as f:
                content = f.read()
                used_encoding = enc
                break
        except:
            continue
            
    if content:
        new_content = content.replace("8000", "8001")
        with open(readme_path, 'w', encoding=used_encoding) as f:
            f.write(new_content)
        print(f"Updated README.md using {used_encoding}")
    else:
        print("Could not read README.md")

if __name__ == "__main__":
    update_readme()
