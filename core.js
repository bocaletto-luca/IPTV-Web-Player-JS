    /********** VARIABILI GLOBALI & FUNZIONI PER PLAYER / CANALI **********/
    /*********************** Author: Bocaletto Luca ***********************/
    let hls; // Istanza globale per Hls.js
    const video = document.getElementById("videoPlayer");
    const spinner = document.getElementById("spinner");
    const channelsContainer = document.getElementById("channelsContainer");
    const fileInput = document.getElementById("m3uFile");
    
    let channels = []; // Array degli elementi canale
    let currentSelectedIndex = -1;
    
    function showSpinner(show = true) {
      spinner.style.display = show ? "flex" : "none";
    }
    
    function playChannel(streamUrl) {
      console.log("Caricamento stream: " + streamUrl);
      showSpinner(true);
      
      if (hls) {
        hls.destroy();
        hls = null;
      }
      
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.once(Hls.Events.MANIFEST_PARSED, () => {
          video.play().then(() => {
            showSpinner(false);
          }).catch(err => {
            console.error("Errore nel play:", err);
            showSpinner(false);
          });
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("Errore HLS:", data);
          showSpinner(false);
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.play().then(() => {
          showSpinner(false);
        }).catch(err => {
          console.error("Errore nel play (nativo):", err);
          showSpinner(false);
        });
      } else {
        alert("Il tuo browser non supporta lo streaming HLS.");
        showSpinner(false);
      }
    }
    
    function parseChannelList(content) {
      const lines = content.split("\n");
      channelsContainer.innerHTML = "";
      channels = [];
      currentSelectedIndex = -1;
      let currentTitle = "";
      lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        if (line.startsWith("#EXTINF")) {
          // Estrae il titolo dal testo dopo la virgola (fallback "Canale IPTV")
          const match = line.match(/,(.*)$/);
          currentTitle = match ? match[1].trim() : "Canale IPTV";
        } else if (line.startsWith("http")) {
          const streamUrl = line;
          const channelDiv = document.createElement("div");
          channelDiv.className = "channel";
          channelDiv.textContent = currentTitle;
          channelDiv.addEventListener("click", function() {
            playChannel(streamUrl);
            currentSelectedIndex = channels.indexOf(channelDiv);
            updateSelection();
          });
          channelsContainer.appendChild(channelDiv);
          channels.push(channelDiv);
        }
      });
    }
    
    // Event listener per il file input: il file scelto dall'utente viene letto e parsato
    fileInput.addEventListener("change", function(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        parseChannelList(content);
      };
      reader.readAsText(file);
    });
    
    function updateSelection() {
      channels.forEach((channel, index) => {
        if (index === currentSelectedIndex) {
          channel.classList.add("selected");
          channel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
          channel.classList.remove("selected");
        }
      });
    }
    
    /********** EVENTI DA TASTIERA **********/
    document.addEventListener("keydown", function(e) {
      // Se l'utente preme "l", simula un click sul file input per ricaricare la lista
      if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        fileInput.click();
        return;
      }
      
      // Navigazione nella lista dei canali
      if (channels.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          currentSelectedIndex = (currentSelectedIndex + 1) % channels.length;
          updateSelection();
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          currentSelectedIndex = (currentSelectedIndex - 1 + channels.length) % channels.length;
          updateSelection();
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (currentSelectedIndex >= 0 && currentSelectedIndex < channels.length) {
            channels[currentSelectedIndex].click();
          }
          return;
        }
      }
      
      // Controlli del player via tastiera
      if (e.key === " ") { // Space per pausa/ripresa
         e.preventDefault();
         video.paused ? video.play() : video.pause();
      } else if (e.key === "+" || e.key === "=") { // Volume su
         e.preventDefault();
         video.volume = Math.min(video.volume + 0.1, 1);
      } else if (e.key === "-") { // Volume giù
         e.preventDefault();
         video.volume = Math.max(video.volume - 0.1, 0);
      } else if (e.key.toLowerCase() === "m") { // Toggle mute
         e.preventDefault();
         video.muted = !video.muted;
      } else if (e.key.toLowerCase() === "f") { // Fullscreen toggle
         e.preventDefault();
         if (!document.fullscreenElement) {
            video.requestFullscreen ? video.requestFullscreen() : (video.webkitRequestFullscreen && video.webkitRequestFullscreen());
         } else {
            document.exitFullscreen ? document.exitFullscreen() : (document.webkitExitFullscreen && document.webkitExitFullscreen());
         }
      } else if (e.key.toLowerCase() === "p") { // Picture-in-Picture toggle
         e.preventDefault();
         if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(err => console.error(err));
         } else {
            video.requestPictureInPicture ? video.requestPictureInPicture().catch(err => console.error(err)) : null;
         }
      }
    });
    
    /********** SUPPORTO JOYPAD (CONTROLLER/TELECOMANDO) CON DEBOUNCE **********/
    const debounceDelay = 250;
    // Impostiamo un oggetto per il debounce degli eventi simulati
    const debounceTimes = {
      ArrowUp: 0,
      ArrowDown: 0,
      Enter: 0,
      " ": 0,
      m: 0,
      f: 0,
      p: 0,
      l: 0, // Per il file input
      // Volume su e giù li gestiamo con i pulsanti RT e LT
      volUp: 0,
      volDown: 0
    };
    
    function simulateKeyEvent(key) {
      const event = new KeyboardEvent("keydown", { key: key, bubbles: true });
      document.dispatchEvent(event);
    }
    
    function pollGamepad() {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      if (gamepads[0]) {
        const gp = gamepads[0];
        let now = Date.now();
        // D-Pad Up → ArrowUp
        if (gp.buttons[12] && gp.buttons[12].pressed) {
          if (now - debounceTimes["ArrowUp"] > debounceDelay) {
            simulateKeyEvent("ArrowUp");
            debounceTimes["ArrowUp"] = now;
          }
        }
        // D-Pad Down → ArrowDown
        if (gp.buttons[13] && gp.buttons[13].pressed) {
          if (now - debounceTimes["ArrowDown"] > debounceDelay) {
            simulateKeyEvent("ArrowDown");
            debounceTimes["ArrowDown"] = now;
          }
        }
        // A Button (indice 0) → Enter
        if (gp.buttons[0] && gp.buttons[0].pressed) {
          if (now - debounceTimes["Enter"] > debounceDelay) {
            simulateKeyEvent("Enter");
            debounceTimes["Enter"] = now;
          }
        }
        // B Button (indice 1) → Space (pausa/ripresa)
        if (gp.buttons[1] && gp.buttons[1].pressed) {
          if (now - debounceTimes[" "] > debounceDelay) {
            simulateKeyEvent(" ");
            debounceTimes[" "] = now;
          }
        }
        // LT (indice 6) → "-" (Volume giù)
        if (gp.buttons[6] && gp.buttons[6].pressed) {
          if (now - debounceTimes["volDown"] > debounceDelay) {
            simulateKeyEvent("-");
            debounceTimes["volDown"] = now;
          }
        }
        // RT (indice 7) → "+" (Volume su)
        if (gp.buttons[7] && gp.buttons[7].pressed) {
          if (now - debounceTimes["volUp"] > debounceDelay) {
            simulateKeyEvent("+");
            debounceTimes["volUp"] = now;
          }
        }
        // X Button (indice 2) → "m" (Toggle mute)
        if (gp.buttons[2] && gp.buttons[2].pressed) {
          if (now - debounceTimes["m"] > debounceDelay) {
            simulateKeyEvent("m");
            debounceTimes["m"] = now;
          }
        }
        // Y Button (indice 3) → "f" (Fullscreen toggle)
        if (gp.buttons[3] && gp.buttons[3].pressed) {
          if (now - debounceTimes["f"] > debounceDelay) {
            simulateKeyEvent("f");
            debounceTimes["f"] = now;
          }
        }
        // LB (indice 4) → "l" (Per riaprire il file input)
        if (gp.buttons[4] && gp.buttons[4].pressed) {
          if (now - debounceTimes["l"] > debounceDelay) {
            simulateKeyEvent("l");
            debounceTimes["l"] = now;
          }
        }
        // Back Button (indice 8) → "p" (Picture-in-Picture)
        if (gp.buttons[8] && gp.buttons[8].pressed) {
          if (now - debounceTimes["p"] > debounceDelay) {
            simulateKeyEvent("p");
            debounceTimes["p"] = now;
          }
        }
      }
      requestAnimationFrame(pollGamepad);
    }
    
    window.addEventListener("gamepadconnected", function(e) {
      console.log("Gamepad collegato:", e.gamepad);
    });
    if (navigator.getGamepads) {
      requestAnimationFrame(pollGamepad);
    }
    
    video.addEventListener("playing", () => showSpinner(false));
    video.addEventListener("waiting", () => showSpinner(true));
