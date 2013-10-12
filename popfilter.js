var Song = function(song_item) {
  this.title = song_item.title;
  this.artist = song_item.artist;
  
  this.get_youtube_id = function(modifier) {
    var id;

    $.ajax({
      type: "GET",
      async: false,
      url: "http://gdata.youtube.com/feeds/api/videos?" + 
           "v=2&license=youtube&alt=json&max-results=1" +
           "&fields=entry(media:group(yt:videoid))&q="  +
           encodeURIComponent(this.artist.toLowerCase() + ' ' + 
                              this.title.toLowerCase() + ' ' +
                              modifier),
      success: function(res) {
        if(res) {
          id = res.feed.entry[0].media$group.yt$videoid.$t;
        }
      }
    });

    return id;
  };
};

var Player = function() {
  var song,
      channels = {'hd1': 'reversed', 'hd2': 'instrumental'},
      tuned_to = 'hd1',

  get_new_song = function() {
    song = new Song(hot100[Math.floor(Math.random() * 40)]);  // top 40
    return song.get_youtube_id(channels[tuned_to]);
  },

  onPlayerReady = function(event) {
    event.target.playVideo();
  },

  onPlayerStateChange = function(event) {
    if (event.data == YT.PlayerState.ENDED) {
      player.loadVideoById(get_new_song());
    } else if (event.data == YT.PlayerState.PLAYING) {
      $('#artist').text(song.artist);
      $('#song').text(song.title);
      $('#playbutton').text("\u275a\u275a");
    }
  },

  onPlayerError = function(event) {
    console.log(song);
    player.loadVideoById(get_new_song());
  },

  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: get_new_song(),
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });

  this.play = function() {
    player.playVideo();
  };

  this.pause = function() {
    player.pauseVideo();
  };

  this.tune_to = function(channel) {
    tuned_to = channel;
    player.loadVideoById(get_new_song());
  };
}
