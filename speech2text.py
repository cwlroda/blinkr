import io
from google.cloud import speech

class Speech2Text():
    def __init__(self):
        # Creates google client
        self.client = speech.SpeechClient()
        self.numLines = 0
        self.results = ''
        
    def calcLines(self):
        for i in range(1, 12):
            self.numChars -= i
            self.numLines += 1
            
            if(self.numChars <= 0):
                return self.numLines
            
    def generateResults(self):
        if self.numLines == 1:
            self.results = '20/200'
        elif self.numLines == 2:
            self.results = '20/100'
        elif self.numLines == 3:
            self.results = '20/70'
        elif self.numLines == 4:
            self.results = '20/50'
        elif self.numLines == 5:
            self.results = '20/40'
        elif self.numLines == 6:
            self.results = '20/30'
        elif self.numLines == 7:
            self.results = '20/25'
        else:
            self.results = '20/20'

    def transcribe(self):
        # Full path of the audio file, Replace with your file name
        file_name = "data/recording.wav"

        #Loads the audio file into memory
        with io.open(file_name, "rb") as file:
            content = file.read()
            audio = speech.RecognitionAudio(content=content)

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            audio_channel_count=2,
            language_code="en-US",
            sample_rate_hertz=16000,
        )

        # Sends the request to google to transcribe the audio
        response = self.client.recognize(request={"config": config, "audio": audio})

        self.numChars = 20
        
        self.calcLines()
        self.generateResults()
        
        return self.results, self.numLines

        # Reads the response
        # print(response.results)
        
        # for result in response.results:
        #     print("Transcript: {}".format(result.alternatives[0].transcript))