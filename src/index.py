import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db

class FileModel(db.Model):
    name = db.StringProperty(required=True)
    data = db.BlobProperty(required=True)
    mimeType = db.StringProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    owner = db.UserProperty(auto_current_user_add=True)
    download_url = db.StringProperty()
 
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
 
class UploadHandler(webapp.RequestHandler):
    def post(self):
        files = self.request.POST.multi.__dict__['_items']
        
        for allfiles in files:            
            allfiles = allfiles[1]
            obj = FileModel(name=allfiles.filename, 
                            data=allfiles.value, mimeType=allfiles.type) 
            obj.put()  
                
            file_url = "http://%s/%d/%s" % (self.request.host, obj.key().id(), allfiles.filename)
            #file_url = "<a href='%s'>%s</a>" % (file_url,file_url) 
                
            obj.download_url=file_url                
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

class ContentHandler(webapp.RequestHandler):
    def get(self):        
        file_list = db.Query(FileModel).order('-created')        
        outstr = template.render('templates/content.html', {'file_list': file_list})
        self.response.out.write(outstr)
        
class DeleteHandler(webapp.RequestHandler):
    def post(self):
        name = self.request.get('NAME')       
        q = db.GqlQuery("SELECT * FROM FileModel where name = '" + name + "'") 
        db.delete(q)        
        self.redirect('/', True)    
        
class DownloadHandler(webapp.RequestHandler):
    def post(self):
        name = self.request.get('NAME')
        
        FileModel = db.GqlQuery("SELECT * FROM FileModel where name = '" + name + "'")
        for data in FileModel:
            if data.name:
                self.response.headers['Content-Disposition'] = 'attachment; filename="%s"' % str(data.name)
                self.response.headers['Content-Type'] = data.mimeType
                self.response.out.write(data.data)  
                
class ViewHandler(webapp.RequestHandler):
    def post(self):
        name = self.request.get('NAME')
        
        FileModel = db.GqlQuery("SELECT * FROM FileModel where name = '" + name + "'")
        for data in FileModel:
            if data.name:
                self.response.headers['Content-Type'] = data.mimeType
                self.response.out.write(data.data)
                
class StreamHandler(webapp.RequestHandler):
    def get(self,id,filename):
        entity = FileModel.get_by_id(int(id))
        self.response.headers['Content-Type'] = entity.mimeType
        self.response.out.write(entity.data)

application = webapp.WSGIApplication([
                                      ('/(\d+)/(.*)', StreamHandler),
                                      ('/view', ViewHandler),
                                      ('/download', DownloadHandler),
                                      ('/content', ContentHandler),
                                      ('/upload', UploadHandler),
                                      ('/delete', DeleteHandler),
                                      ('/.*', MainHandler)],
                                      debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()

