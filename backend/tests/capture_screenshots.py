import subprocess
import time
import json
import urllib.request
import base64
import os
import websocket

SCREENSHOTS_DIR = r"d:\GramaCare\screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
USER_DATA_DIR = r"d:\GramaCare\scratch\chrome_cdp_profile"
os.makedirs(USER_DATA_DIR, exist_ok=True)

# Start Chrome in headless mode with remote debugging
chrome_proc = subprocess.Popen([
    CHROME_PATH,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--remote-allow-origins=*",
    "--remote-debugging-port=9222",
    f"--user-data-dir={USER_DATA_DIR}",
    "--window-size=1440,900"
])

time.sleep(2)

try:
    # Get WebSocket debugger URL
    resp = urllib.request.urlopen("http://127.0.0.1:9222/json")
    targets = json.loads(resp.read().decode())
    ws_url = targets[0]["webSocketDebuggerUrl"]
    print(f"Connected to Chrome CDP: {ws_url}")

    ws = websocket.create_connection(ws_url)
    msg_id = 0

    def send_cmd(method, params=None):
        global msg_id
        msg_id += 1
        payload = {"id": msg_id, "method": method, "params": params or {}}
        ws.send(json.dumps(payload))
        while True:
            res = json.loads(ws.recv())
            if res.get("id") == msg_id:
                return res

    send_cmd("Page.enable")
    send_cmd("Runtime.enable")

    def capture(filename, delay=2):
        time.sleep(delay)
        res = send_cmd("Page.captureScreenshot", {"format": "png"})
        img_b64 = res["result"]["data"]
        out_path = os.path.join(SCREENSHOTS_DIR, filename)
        with open(out_path, "wb") as f:
            f.write(base64.b64decode(img_b64))
        print(f"Captured: {out_path}")

    # 1. Login Page
    print("\nCapturing Login Page...")
    send_cmd("Page.navigate", {"url": "http://127.0.0.1:5173/login"})
    capture("1_login_page.png", delay=2)

    # 2. Login as Patient
    print("\nLogging in as Patient...")
    login_script = """
    (async () => {
        const emailInput = document.querySelector('input[type="email"]');
        const passInput = document.querySelector('input[type="password"]');
        const form = document.querySelector('form');
        if (emailInput && passInput) {
            emailInput.value = 'ramesh_patel@ruralhealth.org';
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            passInput.value = 'Password@123';
            passInput.dispatchEvent(new Event('input', { bubbles: true }));
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    })();
    """
    send_cmd("Runtime.evaluate", {"expression": login_script})
    time.sleep(3)

    # Patient Dashboard
    send_cmd("Page.navigate", {"url": "http://127.0.0.1:5173/patient/dashboard"})
    capture("2_patient_dashboard.png", delay=2)

    # Patient Appointments
    send_cmd("Page.navigate", {"url": "http://127.0.0.1:5173/patient/appointments"})
    capture("3_patient_appointments.png", delay=2)

    # 3. Doctor Portal
    print("\nNavigating to Doctor Portal...")
    # Click Doctor Quick Switcher or login
    doc_switch = """
    (async () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const docBtn = buttons.find(b => b.textContent.includes('Doctor'));
        if (docBtn) docBtn.click();
    })();
    """
    send_cmd("Runtime.evaluate", {"expression": doc_switch})
    time.sleep(3)

    send_cmd("Page.navigate", {"url": "http://127.0.0.1:5173/doctor/dashboard"})
    capture("4_doctor_dashboard.png", delay=2)

    send_cmd("Page.navigate", {"url": "http://127.0.0.1:5173/doctor/prescriptions"})
    capture("5_doctor_prescriptions.png", delay=2)

    # 4. Admin Portal
    print("\nNavigating to Admin Portal...")
    admin_switch = """
    (async () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const adminBtn = buttons.find(b => b.textContent.includes('Admin'));
        if (adminBtn) adminBtn.click();
    })();
    """
    send_cmd("Runtime.evaluate", {"expression": admin_switch})
    time.sleep(3)

    send_cmd("Page.navigate", {"url": "http://127.0.0.1:5173/admin/dashboard"})
    capture("6_admin_dashboard.png", delay=2)

    send_cmd("Page.navigate", {"url": "http://127.0.0.1:5173/admin/doctors"})
    capture("7_admin_doctor_verification.png", delay=2)

    ws.close()
    print("\nAll screenshots captured successfully!")

finally:
    chrome_proc.terminate()
