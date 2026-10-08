const apiKeyInput = document.getElementById('apiKey');
const taskTypeSelect = document.getElementById('taskType');
const userInput = document.getElementById('userInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsBox = document.getElementById('results');
const copyBtn = document.getElementById('copyBtn');

const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function setOutput(message, type = '') {
  resultsBox.innerHTML = `<p class="${type}">${message}</p>`;
}

function buildTaskPrompt(task, content) {
  const baseInstructions = `You are a cybersecurity analysis assistant. Provide practical, clearly structured findings. Focus on risk level, likely issues, evidence, and remediation steps. Avoid creating harmful instructions. For any request involving malicious activity, refuse and redirect to defensive, ethical security work.`;

  switch (task) {
    case 'vulnerability_scan':
      return `${baseInstructions}\n\nTask: Perform a vulnerability assessment on the following code, config, or environment description. Identify likely CVEs, insecure patterns, dangerous defaults, unsafe dependencies, weak authentication, injection risks, or exposure risks. Include severity, root cause, impact, and recommended fixes.\n\nInput:\n${content}`;

    case 'code_review':
      return `${baseInstructions}\n\nTask: Review the following code for security issues. Look for hardcoded secrets, command injection, path traversal, improper input validation, CSRF, XSS, deserialization flaws, insecure crypto, insecure file handling, and configuration issues. Provide specific line-level concerns if possible.\n\nCode:\n${content}`;

    case 'password_strength':
      return `${baseInstructions}\n\nTask: Evaluate the password strength, entropy, and likely resistance to brute force. Explain whether it is weak, moderate, or strong. Also note common password attacks and recommend best practices.\n\nPassword or policy description:\n${content}`;

    case 'threat_assessment':
      return `${baseInstructions}\n\nTask: Perform a threat assessment based on the provided system, process, or scenario. Identify likely threat actors, primary risks, attack paths, exposure factors, and mitigation strategies.\n\nScenario:\n${content}`;

    case 'compliance_check':
      return `${baseInstructions}\n\nTask: Assess the following system, policy, or process for common security compliance concerns. Indicate alignment or gaps against standards like ISO 27001, NIST, SOC 2, GDPR, or PCI DSS if relevant. Explain the risk and recommended controls.\n\nContext:\n${content}`;

    case 'malware_analysis':
      return `${baseInstructions}\n\nTask: Analyze the following suspicious code, script, log, or description for malware behavior. Look for persistence, exfiltration, command and control, privilege escalation, encoded payloads, RAT behavior, or ransomware patterns. Clearly separate observed indicators from hypotheses.\n\nArtifact or behavior:\n${content}`;

    default:
      return `${baseInstructions}\n\nTask: Provide a general cybersecurity analysis of the following input. Summarize risks, highlight any security issues, and propose practical mitigation steps.\n\nInput:\n${content}`;
  }
}

function showLoading() {
  setOutput('Analyzing request. Please wait...', '');
  copyBtn.classList.add('hidden');
}

async function analyzeRequest() {
  const apiKey = apiKeyInput.value.trim();
  const task = taskTypeSelect.value;
  const content = userInput.value.trim();

  if (!apiKey) {
    setOutput('Please enter a Gemini API key.', 'error');
    return;
  }

  if (!task) {
    setOutput('Please select a task type.', 'error');
    return;
  }

  if (!content) {
    setOutput('Please provide a security input or code sample.', 'error');
    return;
  }

  showLoading();

  try {
    const prompt = buildTaskPrompt(task, content);
    const response = await fetch(`${MODEL_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1200
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message || 'Unknown API error.';
      throw new Error(errorMessage);
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('\n') || 'No result returned.';

    resultsBox.innerHTML = `<pre>${escapeHtml(text)}</pre>`;
    copyBtn.classList.remove('hidden');
  } catch (error) {
    console.error(error);
    setOutput(`Analysis failed: ${error.message || 'Something went wrong.'}`, 'error');
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

copyBtn.addEventListener('click', async () => {
  const text = resultsBox.textContent.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
    }, 1200);
  } catch (error) {
    setOutput('Copy failed. You can still select the result text manually.', 'error');
  }
});

analyzeBtn.addEventListener('click', analyzeRequest);
