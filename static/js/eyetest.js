function clickRecord() {
    const recordButton = document.querySelector('#record');
    recordButton.style.backgroundImage = "url('https://www.dropbox.com/s/jlp7ykmjzey7yz7/record-512.png?dl=1')";
}

function clickStop() {
    const recordButton = document.querySelector('#record');
    recordButton.style.backgroundImage = "url('https://cdn.iconscout.com/icon/free/png-512/recording-voice-recognization-speech-audio-record-8-15390.png')";
}

function clickPlay() {
    const playButton = document.querySelector('#play');
    playButton.style.backgroundImage = "url('https://www.dropbox.com/s/46p0csf3ibl6j3b/play.png?dl=1')";
}

window.onload = function () {
    const recordAudio = () =>
        new Promise(async resolve => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            let audioChunks = [];

            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            const start = () => {
                audioChunks = [];
                mediaRecorder.start();
            };

            const stop = () =>
                new Promise(resolve => {
                    mediaRecorder.addEventListener('stop', () => {
                        const audioBlob = new Blob(audioChunks, {'type': 'audio/wav'});
                        const audioUrl = URL.createObjectURL(audioBlob);
                        const audio = new Audio(audioUrl);
                        const play = () => audio.play();
                        resolve({ audioChunks, audioBlob, audioUrl, play });
                    });

                    mediaRecorder.stop();
                });

            resolve({ start, stop });
        });

    const sleep = time => new Promise(resolve => setTimeout(resolve, time));

    const recordButton = document.querySelector('#record');
    const stopButton = document.querySelector('#stop');
    const playButton = document.querySelector('#play');
    const saveButton = document.querySelector('#save');

    let recorder;
    let audio;

    recordButton.addEventListener('click', async () => {
        recordButton.setAttribute('disabled', true);
        stopButton.removeAttribute('disabled');
        playButton.setAttribute('disabled', true);
        saveButton.setAttribute('disabled', true);

        if (!recorder) {
            recorder = await recordAudio();
        }

        recorder.start();
    });

    stopButton.addEventListener('click', async () => {
        recordButton.removeAttribute('disabled');
        stopButton.setAttribute('disabled', true);
        playButton.removeAttribute('disabled');
        saveButton.removeAttribute('disabled');
        audio = await recorder.stop();
        // console.log(audio);
    });

    playButton.addEventListener('click', () => {
        audio.play();
    });

    saveButton.addEventListener('click', () => {
        const reader = new FileReader();
        reader.readAsDataURL(audio.audioBlob);

        reader.onloadend = function() {
            var base64data = reader.result;                
            console.log(base64data);
            sendDataToServer(base64data);
        }
        
        // downloadBlob(audio.audioBlob, "recording.wav");
    });

    function downloadBlob(blob, name) {
        const link = document.createElement("a");
        
        link.href = audio.audioUrl;
        link.download = name;
        
        document.body.appendChild(link);
        
        link.dispatchEvent(
            new MouseEvent('click', { 
                bubbles: true, 
                cancelable: true, 
                view: window 
            })
        );

        document.body.removeChild(link);
    }

    function sendDataToServer(base) {
        base = base.replace('data:audio/wav;base64,', '');

        $.ajax({
            type: 'POST',
            url: '/speech2text',
            data: '{"data": "' + base + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (msg) {
                console.log(msg);
            }
        }).done(function(jsondata, textStatus, jqXHR) {
            console.log(jsondata);

            var lines = jsondata['response']['lines'];
            var results = jsondata['response']['results'];

            localStorage.setItem("lines", lines);
            localStorage.setItem("results", results);

            window.location.pathname = '/results';
        }).fail(function(jsondata, textStatus, jqXHR) {
            alert(jsondata['responseJSON']['message']);
        });
    }
}