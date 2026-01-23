import os

def inject_flicker_fix(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Tiny inline script to prevent login button flicker
    flicker_script = "<script>if(localStorage.getItem('chocodream_user_cache')){document.documentElement.classList.add('has-user');}</script>"
    
    if flicker_script in content:
        return
    
    # Inject into <head>
    if '</head>' in content:
        new_content = content.replace('</head>', f'    {flicker_script}\n</head>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected flicker fix into {filepath}")

def main():
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                inject_flicker_fix(os.path.join(root, file))

if __name__ == "__main__":
    main()
