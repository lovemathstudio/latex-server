const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/compile', async (req, res) => {
  const { latex } = req.body;
  if (!latex) return res.status(400).json({ error: 'latex content required' });

  const id = crypto.randomBytes(8).toString('hex');
  const dir = `/tmp/latex-${id}`;
  
  try {
    fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/doc.tex`, latex);

    exec(
      `cd ${dir} && pdflatex -interaction=nonstopmode doc.tex`,
      { timeout: 30000 },
      (err, stdout, stderr) => {
        if (err && !fs.existsSync(`${dir}/doc.pdf`)) {
          fs.rmSync(dir, { recursive: true });
          return res.status(500).json({ error: 'compile failed', details: stdout });
        }
        const pdf = fs.readFileSync(`${dir}/doc.pdf`);
        fs.rmSync(dir, { recursive: true });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="practice.pdf"');
        res.send(pdf);
      }
    );
  } catch (e) {
    try { fs.rmSync(dir, { recursive: true }); } catch {}
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('LaTeX server running on port 3001'));
