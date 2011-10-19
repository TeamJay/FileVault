import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from google.appengine.api import users

class FileModel(db.Model):
    name = db.StringProperty(required=True)
    data = db.BlobProperty(required=True)
    mimeType = db.StringProperty(required=True)
    fileType = db.StringProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    owner = db.UserProperty(auto_current_user_add=True)
    public = db.BooleanProperty(required=True)
    download_url = db.StringProperty()
 
class MainHandler(webapp.RequestHandler):    
    def get(self): 
        
        user = users.get_current_user()
        if user is None:
            self.redirect(users.create_login_url(self.request.uri))
        else:
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
            
            q = db.Query(FileModel).filter('name', allfiles.filename).filter('owner', users.get_current_user()).count(1)
            
            if q >= 1:                             
                self.response.headers['Content-Type'] = "text/html"
                self.response.out.write("File name already exists: " + allfiles.filename)
                self.response.out.write("<br><a href='/'>Back</a>")
                return
                
            obj = FileModel(name=allfiles.filename,
                                data=allfiles.value, mimeType=allfiles.type, 
                                fileType=getContentType(allfiles.type),
								public=False)
            obj.put()           
            
            file_url = "http://%s/%d/%s" % (self.request.host, obj.key().id(), allfiles.filename)
                
            obj.download_url=file_url
            obj.put()
                
            self.redirect('/', True)
            
""" helper get category """
def getContentType(fileType): 
    if fileType != 'application/pdf':
        content = fileType.split('/')[0].lower()
        if content == 'video': return 'video'
        if content == 'audio': return 'audio'
        if content == 'image': return 'image'
        if content == 'text': return 'text'
        return 'other'
    return 'text'

class ContentHandler(webapp.RequestHandler):
    def get(self):  
        content = self.request.get('content')
        file_list = db.Query(FileModel).order('-created').filter('fileType', content).filter('owner', users.get_current_user())      
        outstr = template.render('templates/content.html', {'file_list': file_list})
        self.response.out.write(outstr)
        
class DeleteHandler(webapp.RequestHandler):
    def post(self):
        q = db.Query(FileModel).filter('owner', users.get_current_user()).filter('name', self.request.get('value'))
        db.delete(q)

class RenameHandler(webapp.RequestHandler):
    def post(self):
        
        newname = self.request.get('newname')

        q = db.Query(FileModel).filter('owner', users.get_current_user()).filter('name', self.request.get('oldname'))
        for data in q:
            if data.name:
                data.name = newname
                db.put(data)
                
class PublicChanger(webapp.RequestHandler):
    def post(self):
        
        name = self.request.get('name')
        status = self.request.get('public')

        q = db.Query(FileModel).filter('owner', users.get_current_user()).filter('name', name)
        for data in q:
            if data.name:
                data.public = status
                db.put(data)
        
class DownloadHandler(webapp.RequestHandler):
    def post(self):
        q = db.Query(FileModel).filter('owner', users.get_current_user()).filter('name', self.request.get('NAME'))

        for data in q:
            if data.name:
                self.response.headers['Content-Disposition'] = 'attachment; filename="%s"' % str(data.name)
                self.response.headers['Content-Type'] = data.mimeType
                self.response.out.write(data.data) 
                
class StreamHandler(webapp.RequestHandler):
    def get(self,id,filename):
        entity = FileModel.get_by_id(int(id))
        self.response.headers['Content-Type'] = entity.mimeType
        self.response.out.write(entity.data)

application = webapp.WSGIApplication([
                                      ('/(\d+)/(.*)', StreamHandler),
                                      ('/download', DownloadHandler),
                                      ('/content', ContentHandler),
                                      ('/upload', UploadHandler),
                                      ('/delete', DeleteHandler),
                                      ('/rename', RenameHandler),
									  ('/publicchange', PublicChanger),
                                      ('/.*', MainHandler)],
                                      debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()

