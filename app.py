from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='template', static_url_path='')

# Route to serve the main HTML file
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Route to serve other static files (CSS, JS, images, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
