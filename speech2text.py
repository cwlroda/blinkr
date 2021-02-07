import io
from google.cloud import speech

class Speech2Text():
    def __init__(self):
        # Creates google client
        self.client = speech.SpeechClient()

    def transcribe(self):
        # Full path of the audio file, Replace with your file name
        file_name = "data/recording.wav"

        #Loads the audio file into memory
        with io.open(file_name, "rb") as file:
            content = file.read()
            audio = speech.RecognitionAudio(content=content)

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            audio_channel_count=1,
            language_code="en-US",
            sample_rate_hertz=48000,
        )

        # Sends the request to google to transcribe the audio
        response = self.client.recognize(request={"config": config, "audio": audio})

        # Reads the response
        print(response.results)
        for result in response.results:
            print("Transcript: {}".format(result.alternatives[0].transcript))