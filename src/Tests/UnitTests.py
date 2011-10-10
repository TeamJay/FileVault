
import unittest
from google.appengine.ext import db
from google.appengine.ext import testbed

class TestModel(db.Model):
    name = db.StringProperty(required=True)
    data = db.BlobProperty(required=True)
    mimeType = db.StringProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    owner = db.UserProperty(auto_current_user_add=True)
    download_url = db.StringProperty()
    
class TestModelTwo(db.Model):
    name = db.StringProperty(required=True)
    data = db.BlobProperty(required=True)
    mimeType = db.StringProperty(required=True)
    fileType = db.StringProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    owner = db.UserProperty(auto_current_user_add=True)
    download_url = db.StringProperty()
    
class TestModelThree(db.Model):
    name = db.StringProperty(required=True)
    data = db.BlobProperty(required=True)
    mimeType = db.StringProperty(required=True)
    fileType = db.StringProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    owner = db.UserProperty(auto_current_user_add=True)
    download_url = db.StringProperty()

class Test(unittest.TestCase):

    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()

    def tearDown(self):
        self.testbed.deactivate()

    """ Check to see if an entity has been added to the datastore """
    def testUpload(self):
        TestModel(name="file", data="1", mimeType="text/plain").put()
        self.assertEqual(1, len(TestModel.all().fetch(2)))
    
    """ Test for correct content added to the datastore for displaying """
    def testContent(self):
        TestModel(name="file", data="1", mimeType="text/plain").put()
        # get entity from datastore, (is one and only entry) thus ID = 1
        name = TestModel.get_by_id(1).name
        self.assertEquals(name, "file")     
        
    """ Test for multiple content added to the datastore for displaying """
    def testMultiContent(self):
        TestModel(name="file", data="1", mimeType="text/plain").put()
        TestModel(name="file1", data="1", mimeType="text/plain").put()
        content = db.Query(TestModel)
        self.assertEquals(content[1].name, "file1") 
        
    """ Test for correct ordered content added to the datastore for displaying """
    def testMultiOrderedContent(self):
        TestModel(name="file", data="1", mimeType="text/plain").put()
        TestModel(name="file1", data="1", mimeType="text/plain").put()
        content = db.Query(TestModel).order('-created').fetch(1)
        self.assertEquals(content[0].name, "file1")
        
    """ Test delete from the datastore based on name """
    def testDelete(self):
        TestModel(name="file", data="1", mimeType="text/plain").put()
        q = db.Query(TestModel).filter("name", "file").fetch(1)
        db.delete(q)
        result = db.Query(TestModel).count(1)
        self.assertEqual(0, result)
        
    """ Test get mimeType and Data for downloading, streaming and viewing via the browser """
    def testDownloadViewStream(self):
        TestModel(name="file", data="1", mimeType="text/plain").put()
        content = db.Query(TestModel).fetch(1)
        self.assertEqual("1", content[0].data)
        self.assertEqual("text/plain", content[0].mimeType)
        
    """ Test if item in datastore gets renamed """
    def testRename(self):
        TestModel(name="file", data="1", mimeType="text/plain").put()
        
        q = db.GqlQuery("SELECT * FROM TestModel where name = 'file'")
        for data in q:
            if data.name:
                data.name = 'newFileName'
                db.put(data)
                
        q = db.Query(TestModel).filter("name", "newFileName").fetch(1)  
        self.assertEqual(q[0].name, "newFileName")
        
    """ Test if content gets filtered by types """
    def testFilteredContent(self):        
        TestModelTwo(name="file2", data="1", mimeType="video/ogg", fileType="video").put()
        TestModelTwo(name="file", data="1", mimeType="text/plain", fileType="text").put()
        TestModelThree(name="file", data="1", mimeType="text/plain", fileType="text").put()
        q = db.Query(TestModelTwo).filter("fileType", "text").fetch(2)
        q2 = db.Query(TestModelThree).fetch(2)
        self.assertEqual(q[0].fileType, q2[0].fileType)
        
    """ Test uploading same name file detected """
    def testCheckUploadNameExists(self):
        TestModel(name="file", data="1", mimeType="text/plain").put()  
        TestModel(name="file", data="1", mimeType="text/plain").put()       
        q = db.Query(TestModel).filter('name', "file").count(4)
        self.assertEqual(q, 2)


if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()
    