from flask import Flask, send_from_directory, abort, redirect

app = Flask(__name__, static_folder='template', static_url_path='')

# Route to serve the main HTML file
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Route to serve manifest.json
@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory('.', 'manifest.json')

# Route to serve serviceWorker.js
@app.route('/serviceWorker.js')
def serve_service_worker():
    return send_from_directory('.', 'serviceworker.js')

# Update file paths in the HTML file to correctly reference the `template/` directory
@app.route('/src/<path:path>')
def serve_src_files(path):
    return send_from_directory(app.static_folder, path)

# Route to serve other static files (CSS, JS, images, etc.)
@app.route('/<path:path>')
def serve_static(path):
    try:
        # Check if the file exists in the template folder
        return send_from_directory(app.static_folder, path)
    except FileNotFoundError:
        # If not found in template, check the root directory
        try:
            return send_from_directory('.', path)
        except FileNotFoundError:
            abort(404)

# Redirect any requests to `/None` to the home page
@app.route('/None')
def handle_none():
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)