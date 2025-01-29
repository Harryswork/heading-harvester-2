from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.request
from urllib.error import URLError
from urllib.parse import urlparse
import ssl

class HeadingHarvesterHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/fetch-url':
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            url = data.get('url')

            try:
                # Create SSL context that ignores certificate verification
                context = ssl.create_default_context()
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
                
                if not url.startswith(('http://', 'https://')):
                    url = 'https://' + url

                # Fetch the URL content
                req = urllib.request.Request(
                    url,
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                )
                response = urllib.request.urlopen(req, context=context)
                html = response.read().decode('utf-8')

                # Send response back to client
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(html.encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            return SimpleHTTPRequestHandler.do_POST(self)

    def do_GET(self):
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, HeadingHarvesterHandler)
    print('Server running on port 8080...')
    httpd.serve_forever() 