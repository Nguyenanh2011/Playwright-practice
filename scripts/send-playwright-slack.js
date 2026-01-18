const fs = require('fs');
const path = require('path');

const resultsPath = path.resolve(process.cwd(), 'test-results', 'results.json');
let passed = 0;
let failed = 0;
let total = 0;

function countStatuses(obj) {
  if (!obj) return { p: 0, f: 0, t: 0 };
  let p = 0;
  let f = 0;
  let t = 0;

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === 'object') {
      if (node.results && Array.isArray(node.results)) {
        node.results.forEach((r) => {
          if (r && r.status) {
            t++;
            if (r.status === 'passed') p++;
            if (r.status === 'failed') f++;
          }
        });
      }
      if (node.status && typeof node.status === 'string') {
        t++;
        if (node.status === 'passed') p++;
        if (node.status === 'failed') f++;
      }
      Object.keys(node).forEach((k) => walk(node[k]));
    }
  };

  walk(obj);
  return { p, f, t };
}

if (fs.existsSync(resultsPath)) {
  try {
    const raw = fs.readFileSync(resultsPath, 'utf8');
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const passMatches = (raw.match(/"status"\s*:\s*"passed"/g) || []).length;
      const failMatches = (raw.match(/"status"\s*:\s*"failed"/g) || []).length;
      passed = passMatches;
      failed = failMatches;
      total = passed + failed;
    }

    if (parsed) {
      const { p, f, t } = countStatuses(parsed);
      passed = p;
      failed = f;
      total = t || p + f;
    }
  } catch (err) {
    console.error('Error reading/parsing results.json:', err);
  }
} else {
  console.warn('results.json not found at', resultsPath);
}

const webhook = process.env.SLACK_WEBHOOK_URL;
const jobStatus = process.env.JOB_STATUS || 'unknown';
const repo = process.env.GITHUB_REPOSITORY || '';
const workflow = process.env.GITHUB_WORKFLOW || '';
const runId = process.env.GITHUB_RUN_ID || '';

const url = repo && runId ? `https://github.com/${repo}/actions/runs/${runId}` : '';

const textLines = [];
textLines.push(`Playwright Tests finished — Status: ${jobStatus}`);
if (repo) textLines.push(`Repository: ${repo}`);
if (workflow) textLines.push(`Workflow: ${workflow}`);
if (runId) textLines.push(`Run: ${runId}`);
if (url) textLines.push(`URL: ${url}`);
textLines.push(`Passed: ${passed}`);
textLines.push(`Failed: ${failed}`);
textLines.push(`Total: ${total}`);

const payload = { text: textLines.join('\n') };

async function post() {
  if (!webhook) {
    console.warn('SLACK_WEBHOOK_URL not provided; printing payload to stdout');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('Failed to send Slack message', res.status, body);
    } else {
      console.log('Slack notification sent');
    }
  } catch (err) {
    console.error('Error sending Slack message:', err);
  }
}

post().then(() => process.exit(0));
