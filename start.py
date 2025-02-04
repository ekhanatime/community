import subprocess
import webbrowser
import time

print("Starting server...")
server = subprocess.Popen(["py", "-m", "flask", "--app", "api", "run", "--debug"], 
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE)

time.sleep(2)  # Wait for server to start
print("Opening browser...")
webbrowser.open('http://localhost:5000')

print("\nGame is running! Press Ctrl+C to stop the server.")
try:
    server.wait()
except KeyboardInterrupt:
    server.terminate()
    print("\nServer stopped.")
