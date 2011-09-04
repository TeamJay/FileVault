import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

from google.appengine.ext.webapp.util import run_wsgi_app

from google.appengine.ext import db
 
class MainHandler(webapp.RequestHandler):
    
    def get(self): 
        path = self.request.path
        temp = os.path.join(
            os.path.dirname(__file__),
            'templates/%s' % path)        
        if not os.path.isfile(temp):
            temp = os.path.join(
            os.path.dirname(__file__),
            'templates/index.html')   
            
        outstr = template.render(temp, {})
        self.response.out.write(outstr)
        
class FileModel(db.Model):
    name = db.StringProperty(required=True)
    data = db.BlobProperty(required=True)
    mimeType = db.StringProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    owner = db.UserProperty(auto_current_user_add=True)
 
class UploadHandler(webapp.RequestHandler):        
    def post(self):
        files = self.request.POST.multi.__dict__['_items']
        for allfiles in files:
            allfiles = allfiles[1]
            obj = FileModel(name=allfiles.filename, 
                            data=allfiles.value, mimeType=allfiles.type)
            obj.put()
                
        self.redirect('/', True)
          
"""
    # converts supported file extensions to MIME type
    # http://en.wikipedia.org/wiki/Internet_media_type#List_of_common_media_types
    def getContentType(self, filename): 
        ext = filename.split('.')[-1].lower()
        if ext == 'jpg' or ext == 'jpeg': return 'image/jpeg'
        if ext == 'png': return 'image/png'
        if ext == 'gif': return 'image/gif'
        if ext == 'svg': return 'image/svg+xml'
        return None
"""

application = webapp.WSGIApplication([
                                      ('/upload', UploadHandler),
                                      ('/.*', MainHandler)],
                                      debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
