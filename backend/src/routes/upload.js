const express = require('express');
const router = express.Router();
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

router.post('/upload', async (req, res) => {
  try {
    const [result] = await client.labelDetection(req.file.buffer);
    const weed = result.labelAnnotations.find(label => label.description.toLowerCase().includes('weed'));

    if (weed) {
      res.json({
        name: weed.description,
        description: 'Detailed information about the weed.',
        affiliateLink: 'https://affiliate-link.com/herbicide',
      });
    } else {
      res.status(404).json({ message: 'Weed not identified.' });
    }
  } catch (err) {
    console.error('Error processing image:', err);
    res.status(500).json({ message: 'Error processing image.' });
  }
});

module.exports = router;
