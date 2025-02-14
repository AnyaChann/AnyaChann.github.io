$(document).ready(() => {
  if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
    // Load YouTube IFrame API if not already loaded
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    // If API is already loaded, set up event listeners
    setupEventListeners();
  }
});

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
  setupEventListeners();
}

function setupEventListeners() {
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
      if (player && typeof player.playVideo === 'function') {
        player.playVideo(); // Play the video
      }
      $("#music-widget").fadeIn(); // Show the music widget
      $("#player").show(); // Ensure the player is visible
    } else {
      $(".message").removeClass("no-anim").addClass("closeNor");
      $(".heart")
        .removeClass("openHer")
        .removeClass("openedHer")
        .addClass("closeHer");
      $(".container").stop().animate({ backgroundColor: "#fce4ec" }, 2000);
      console.log("fechando");
      if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo(); // Pause the video
      }
      $("#music-widget").fadeOut(); // Hide the music widget
      $("#player").hide(); // Hide the player
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
    if (player && typeof player.playVideo === 'function') {
      player.playVideo();
    }
    document.getElementById('play-button').style.display = 'none';
    document.getElementById('pause-button').style.display = 'inline-flex';
  });

  document.getElementById('pause-button').addEventListener('click', () => {
    if (player && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    }
    document.getElementById('pause-button').style.display = 'none';
    document.getElementById('play-button').style.display = 'inline-flex';
  });

  document.getElementById('next-button').addEventListener('click', () => {
    if (player && typeof player.nextVideo === 'function') {
      player.nextVideo();
    }
  });

  document.getElementById('prev-button').addEventListener('click', () => {
    if (player && typeof player.previousVideo === 'function') {
      player.previousVideo();
    }
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

interact('#music-widget').draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
      endOnly: true
    })
  ],
  autoScroll: true,
  listeners: {
    move: dragMoveListener
  }
});

function dragMoveListener(event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}