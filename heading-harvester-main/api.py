from flask import Flask, request, jsonify
import urllib.request
import ssl
from bs4 import BeautifulSoup
from flask_cors import CORS
import json
from urllib.parse import urlparse
import os

app = Flask(__name__)
CORS(app)

# Add a simple home route
@app.route('/')
def home():
    return jsonify({
        "status": "active",
        "endpoints": {
            "harvest": "/api/harvest",
            "stats": "/api/harvest/stats"
        },
        "documentation": "Add your documentation URL here"
    })

@app.route('/api/harvest', methods=['POST'])
def harvest_headings():
    try:
        data = request.get_json()
        urls = data.get('urls', [])
        
        if isinstance(urls, str):
            urls = [urls]
            
        results = []
        
        for url in urls:
            try:
                # Validate and clean URL
                if not url.startswith(('http://', 'https://')):
                    url = 'https://' + url
                
                # Create SSL context
                context = ssl.create_default_context()
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
                
                # Make request
                req = urllib.request.Request(
                    url,
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                response = urllib.request.urlopen(req, context=context)
                html = response.read().decode('utf-8')
                
                # Parse HTML
                soup = BeautifulSoup(html, 'html.parser')
                headings = []
                
                for tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                    for heading in soup.find_all(tag):
                        headings.append({
                            'type': tag.upper(),
                            'text': heading.get_text().strip(),
                            'level': int(tag[1])
                        })
                
                results.append({
                    'url': url,
                    'status': 'success',
                    'headings': headings,
                    'total_headings': len(headings)
                })
                
            except Exception as e:
                results.append({
                    'url': url,
                    'status': 'error',
                    'error': str(e)
                })
        
        return jsonify({
            'status': 'success',
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/harvest/stats', methods=['POST'])
def heading_stats():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({
                'status': 'error',
                'error': 'URL is required'
            }), 400
            
        # Validate and clean URL
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        # Create SSL context
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        # Make request
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        response = urllib.request.urlopen(req, context=context)
        html = response.read().decode('utf-8')
        
        # Parse HTML
        soup = BeautifulSoup(html, 'html.parser')
        stats = {
            'h1_count': len(soup.find_all('h1')),
            'h2_count': len(soup.find_all('h2')),
            'h3_count': len(soup.find_all('h3')),
            'h4_count': len(soup.find_all('h4')),
            'h5_count': len(soup.find_all('h5')),
            'h6_count': len(soup.find_all('h6'))
        }
        
        return jsonify({
            'status': 'success',
            'url': url,
            'stats': stats,
            'total_headings': sum(stats.values())
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 