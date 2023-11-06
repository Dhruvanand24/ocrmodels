import express from 'express';
import Tesseract from 'tesseract.js';
import multer from 'multer';
import cors from 'cors';
import { closest } from 'fastest-levenshtein';
import vision  from '@google-cloud/vision';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/*
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'path-to-your-service-account-key.json',
});

app.use(bodyParser.json());
*/

const keywords = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'pipe', 'bend', 'swr', 's.w.r.','s.w.r.pipe', 'swrpipe', '|', '"', 'tee', 'Tee', 'socket', 'kunalkumar' ]; // Your list of keywords
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const imageBuffer = req.file.buffer;
  const selectedEngine = req.query.engine;

  if (selectedEngine === 'google-vision') {
    try {
      /*const [result] = await client.documentTextDetection(request);
      const text = result.fullTextAnnotation.text;
      res.json({ text });
      */

      res.json({ocrText: 'enter google cloud vision api key', suggestedwords: 'nothing to show here'})
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error processing image' });
    }
  } else if (selectedEngine === 'tesseract') {
    Tesseract.recognize(imageBuffer, 'eng', { logger: (info) => console.log(info) })
      .then(({ data: { text } }) => {
        let words = text.split(' ');
        let ans = '';
        for(const word of words){
          ans = ans + ' ' + closest(word, keywords);
        }
        res.json({ ocrText: text, suggestedwords: ans});
      })
      .catch((error) => {
        console.error('Tesseract OCR Error:', error);
        res.status(500).send('Tesseract OCR process failed.');
      });
  } else {
    res.status(400).send('Invalid OCR engine selected.');
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
