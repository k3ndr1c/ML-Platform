import os
import spacy
import sklearn
import numpy as np

from string import punctuation

from spacy.lang.en.stop_words import STOP_WORDS
from spacy.tokenizer import Tokenizer

# Spacy's pretrained NLP models to help parse text
nlp = spacy.load("en_core_web_sm")

# Stop words for tokenizer
stop_words = set(STOP_WORDS)

# Symbols set to help clean data
symbols = set(punctuation + '\n') 


class TextPreprocessor(object):

    def __init__(self):
        pass
    
    def preprocess_text_file(self, file_path):

        cleaned_text = []
        file_path = file_path
        with open(file_path, encoding="utf8", errors="replace") as f:
            for line in f:
                if line == '\n':
                    continue
                else:
                    tokens = nlp(line)
                    words = [token.lemma_.lower() for token in tokens]
                    words = [w for w in words if self._predicate_filter(w)]
                    for w in words:
                        cleaned_text.append(w)
        return ' '.join(cleaned_text)


    def _predicate_filter(self, word):

        IS_ALPHA = word.isalpha()
        NOT_IN_STOP_WORDS = word not in stop_words
        NOT_IN_SYMBOLS = word not in symbols

        return IS_ALPHA and NOT_IN_STOP_WORDS and NOT_IN_STOP_WORDS
