import joblib

from sklearn.preprocessing import LabelEncoder

from .TextPreprocessor import TextPreprocessor


classes = [
    'alt.atheism', 'comp.graphics', 'comp.os.ms-windows.misc',
    'comp.sys.ibm.pc.hardware', 'comp.sys.mac.hardware',
    'comp.windows.x', 'misc.forsale', 'rec.autos',
    'rec.motorcycles', 'rec.sport.baseball', 'rec.sport.hockey',
    'sci.crypt', 'sci.electronics', 'sci.med', 'sci.space',
    'soc.religion.christian', 'talk.politics.guns',
    'talk.politics.mideast', 'talk.politics.misc', 'talk.religion.misc'
]

class DocumentClassifier(object):

    def __init__(self):
        self.label_encoder = LabelEncoder().fit(classes)
        self.classifier = joblib.load('document-classifier.pkl')
        self.preprocessor = TextPreprocessor()

    def predict(self, file_path):
        X_data = self.preprocessor.preprocess_text_file(file_path)
        y_predict = self.classifier.predict([X_data])
        class_prediction = self.label_encoder.inverse_transform(y_predict)
        return class_prediction[0]
