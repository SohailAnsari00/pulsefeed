from flask import Flask, render_template

app = Flask(__name__, template_folder='template', static_folder='template')

@app.route('/')
@app.route('/sohail')
def home():
    return render_template('index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)

@app.route('/serviceWorker.js')
def service_worker():
    return app.send_static_file('serviceworker.js')

if __name__ == '__main__':
    app.run(debug=True)