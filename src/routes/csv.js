const express = require('express');

const router = express.Router();
const appRoot = require('app-root-path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const crypto = require('crypto');
const { writeCSVData } = require('../services/writeCSVData');

const isFileExists = async (filename) => {
  try {
    fs.accessSync(`${appRoot}/src/uploads/${filename}.csv`, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

router.post('/csv', upload.single('csv'), async (req, res) => {
  const { file } = req;
  const hash = crypto.createHash('md5');
  const filename = hash.update(file.buffer).digest('hex');

  if (!await isFileExists(filename)) {
    try {
      fs.writeFileSync(`${appRoot}/src/uploads/${filename}.csv`, file.buffer);
      const dbWritingResult = await writeCSVData(filename);
      const { statusCode, message } = dbWritingResult;
      res.status(statusCode).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(400).json({ message: 'File already exists' });
  }
});

module.exports = router;
