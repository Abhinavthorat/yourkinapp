from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- Configuration ---
# In production (Render), we mount a disk at /var/data
# In local development, we just use a local 'data' folder
# We check if /var/data exists and is writable, otherwise fallback
if os.path.exists('/var/data'):
    DATA_DIR = '/var/data'
else:
    DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

EMAILS_FILE = os.path.join(DATA_DIR, 'emails.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

print(f"📂 Storage path: {EMAILS_FILE}")

def load_emails():
    if not os.path.exists(EMAILS_FILE):
        return []
    try:
        with open(EMAILS_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading emails: {e}")
        return []

def save_email(email):
    emails = load_emails()
    
    # Check for duplicates
    if any(e['email'] == email for e in emails):
        return False, "Email already registered"
    
    new_entry = {
        'email': email,
        'timestamp': datetime.now().isoformat(),
        'source': 'website'
    }
    
    emails.append(new_entry)
    
    try:
        with open(EMAILS_FILE, 'w') as f:
            json.dump(emails, f, indent=2)
        return True, "Success"
    except Exception as e:
        return False, str(e)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    success, message = save_email(email)
    
    if success:
        return jsonify({"message": "Success", "text": "We'll get back to you."}), 200
    else:
        # If duplicate, we still return 200 to the user so they don't worry, 
        # but semantically it's a "success" in capturing intent.
        if message == "Email already registered":
             return jsonify({"message": "Success", "text": "You're already on the list!"}), 200
        return jsonify({"error": message}), 500

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy", 
        "storage": EMAILS_FILE,
        "count": len(load_emails())
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
