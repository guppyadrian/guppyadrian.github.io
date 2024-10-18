function setSong(song) {

  if (!(song in songList)) {
    songList[curSong] = new Audio('music/' + curSong + '.mp3');
    songList[curSong].loop = true;
    songList[curSong].volume = 0;
    songList[curSong].play();
  }
  
  if (prevSong !== song) {
    songList[prevSong].pause();
    songList[prevSong].currentTime = 0;
  }
  if (song !== curSong) {
    prevSong = curSong;
  }
  curSong = song;

  
  
}
