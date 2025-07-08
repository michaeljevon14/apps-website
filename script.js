async function loadApps() {
  const response = await fetch('apps.json');
  const apps = await response.json();

  const form = document.getElementById('appForm');
  apps.forEach((app, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <label class="inline-flex items-center">
        <input type="checkbox" name="app" value="${app.id}" class="form-checkbox h-5 w-5 text-blue-600">
        <span class="ml-2">${app.name}</span>
      </label>`;
    form.appendChild(div);
  });
}

function generateScript(selectedApps) {
  let script = '@echo off\n';
  script += 'echo Installing selected apps...\n';
  selectedApps.forEach(id => {
    script += `winget install --id ${id} -e\n`;
  });
  script += 'pause\n';
  return script;
}

function download(filename, content) {
  // Add UTF-8 BOM header to force Windows CMD to interpret encoding correctly
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.getElementById('downloadLink');
  a.href = url;
  a.classList.remove('hidden');
}


document.getElementById('generateBtn').addEventListener('click', () => {
  const checked = Array.from(document.querySelectorAll('input[name="app"]:checked'));
  const ids = checked.map(input => input.value);
  const script = generateScript(ids);
  download('install_apps.bat', script);
});

loadApps();
