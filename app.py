import flask
import json
import base64
from flask import Flask, request, render_template
from speech2text import Speech2Text

app = Flask(__name__)

def base64towav(base64_data):
    base64_bytes = base64_data.encode('utf-8')
        
    with open('data/recording.wav', 'wb') as file:
        decoded_data = base64.decodebytes(base64_bytes)
        file.write(decoded_data)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/eyetest')
def eyetest():
    return render_template('eyetest.html')

@app.route('/eyetips')
def eyetips():
    return render_template('eyetips.html')

@app.route('/results')
def results():
    return render_template('results.html')

@app.route('/speech2text', methods=['POST'])
def speech2text():
    try:
        # print(request.json['data'])
        # print("Success")
        
        data = request.json['data']
        base64towav(data)
        
        transcriber = Speech2Text()
        results, lines = transcriber.transcribe()
        
        response = {}
        response['response'] = {
            'results': str(results),
            'lines': str(lines),
        }
        
        return flask.jsonify(response)
        
    except Exception as ex:
        res = dict({'message': str(ex)})
        print(res)
        return app.response_class(response=json.dumps(res), status=500, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True,
            port=8000,
            use_reloader=True)