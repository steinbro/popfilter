#!/usr/bin/env python

import json
from xml.etree import ElementTree

import webapp2
from google.appengine.api import urlfetch


class MainHandler(webapp2.RequestHandler):
    def get(self):
        '''Fetch the Billboard Hot 100 XML, and return JSONP of
        artists/titles.'''
        songs = []
        url = 'http://www.billboard.com/rss/charts/hot-100'

        result = urlfetch.fetch(url)
        if result.status_code == 200:
            root = ElementTree.fromstring(result.content)
            for item in root.iter('item'):
                songs.append({'title': item.find('chart_item_title').text,
                              'artist': item.find('artist').text})

        self.response.headers['Content-Type'] = 'text/javascript'
        self.response.write('var hot100 = ' + json.dumps(songs) + ';')


app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
