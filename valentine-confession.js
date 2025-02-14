let player;
const songTitles = {
  '4adZ7AguVcw': 'blue - yung kai',
  'lTieq1DrEec': 'I like you - Post Malone'
};

function onYouTubeIframeAPIReady() {
  console.log("YouTube IFrame API Ready");
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: '4adZ7AguVcw',
    playerVars: {
      'playlist': '4adZ7AguVcw,lTieq1DrEec'
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  console.log("Player Ready");
  $("#messageState").on("change", (x) => {
    $(".message").removeClass("openNor").removeClass("closeNor");
    if ($("#messageState").is(":checked")) {
      $(".message")
        .removeClass("closed")
        .removeClass("no-anim")
        .addClass("openNor");
      $(".heart")
        .removeClass("closeHer")
        .removeClass("openedHer")
        .addClass("openHer");
      $(".container").stop().animate({ backgroundColor: "#f48fb1" }, 2000);
      console.log("Abrindo");
      player.playVideo(); // Play the video
      $("#music-widget").fadeIn(); // Show the music widget
    } else {
      $(".message").removeClass("no-anim").addClass("closeNor");
      $(".heart")
        .removeClass("openHer")
        .removeClass("openedHer")
        .addClass("closeHer");
      $(".container").stop().animate({ backgroundColor: "#fce4ec" }, 2000);
      console.log("fechando");
      player.pauseVideo(); // Pause the video
      $("#music-widget").fadeOut(); // Hide the music widget
    }
  });

  $(".message").on(
    "webkitAnimationEnd oanimationend msAnimationEnd animationend",
    function (e) {
      console.log("Animation End");
      if ($(".message").hasClass("closeNor")) $(".message").addClass("closed");
      $(".message")
        .removeClass("openNor")
        .removeClass("closeNor")
        .addClass("no-anim");
    }
  );

  $(".heart").on(
    "webkitAnimationEnd oanimationend msAnimationEnd animationend",
    function (e) {
      console.log("Animation End");
      if (!$(".heart").hasClass("closeHer"))
        $(".heart").addClass("openedHer").addClass("beating");
      else $(".heart").addClass("no-anim").removeClass("beating");
      $(".heart").removeClass("openHer").removeClass("closeHer");
    }
  );

  document.getElementById('play-button').addEventListener('click', () => {
    player.playVideo();
    document.getElementById('play-button').style.display = 'none';
    document.getElementById('pause-button').style.display = 'inline-flex';
  });

  document.getElementById('pause-button').addEventListener('click', () => {
    player.pauseVideo();
    document.getElementById('pause-button').style.display = 'none';
    document.getElementById('play-button').style.display = 'inline-flex';
  });

  document.getElementById('next-button').addEventListener('click', () => {
    player.nextVideo();
  });

  document.getElementById('prev-button').addEventListener('click', () => {
    player.previousVideo();
  });

  // Make the music widget draggable within the browser window
  $("#music-widget").draggable({
    containment: "window"
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    const videoId = player.getVideoData().video_id;
    const songTitle = songTitles[videoId] || 'Unknown';
    document.getElementById('status-bar').innerText = `Playing: ${songTitle}`;
  } else if (event.data === YT.PlayerState.PAUSED) {
    document.getElementById('status-bar').innerText = 'Paused';
  }
}