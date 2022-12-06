var app = new Vue({
  el: "#app",
  data: {
    bitmapString: "",
    bitmapFramesString: "",
    currentIndex: -1, //frames starts empty
    frames: [],
    width: 8,
    height: 8,
    time: 500, //miliseconds
    playing: false,
    loop: false
  },
  methods: {
    cellStyle(h, w) {
      if (typeof this.currentFrame !== "undefined") {
        return {
          backgroundColor: this.currentFrame[h][w] ? "#FDE02D" : "black"
        }
      } else {
        return {
          backgroundColor: "black"
        }
      }
    },
    flipCell(h, w) {
      let newArray = this.frames[this.currentIndex];
      newArray[h][w] = !this.frames[this.currentIndex][h][w];
      Vue.set(this.frames, this.currentIndex, newArray);
    },
    mouseover(h, w, e) {
      if (e.buttons == 1 || e.buttons == 3) {
        this.flipCell(h, w);
      }
    },
    addFrame() {
      let array = [];
      for (let h = 0; h < Number(this.height); h++) {
        let subArray = [];
        for (let w = 0; w < Number(this.width); w++) {
          subArray.push(false);
        }
        array.push(subArray);
      }
      this.frames.push(array);
      this.currentIndex = this.frames.length - 1;
    },
    deleteFrame() {
      if (this.frames.length === 1) { return; }

      this.frames.splice(this.currentIndex, 1);

      if (this.frames.length === 1) {
        this.currentIndex = 0;
      } else if (this.frames.length === this.currentIndex) {
        this.currentIndex = this.frames.length - 1;
      }
    },
    frameDisplay(index) {
      let string = "{ ";
      for (let h = 0; h < this.frames[index].length; h++) {
        string += "B"
        for (let w = 0; w < this.frames[index][h].length; w++) {
          if (this.frames[index][h][w]) {
            string += "1";
          } else {
            string += "0";
          }
        }
        //Dont put comma and new line at end
        if (h != (this.frames[index].length - 1)) {
          string += ",\n"
        }
      }
      string += " }";

      return string;
    },
    nextFrame() {
      if (this.currentIndex < (this.frames.length - 1)) {
        this.currentIndex += 1;
      }
    },
    playButton() {
      this.playing = !this.playing;
      this.play();
    },
    play() {
      if (this.playing) {
        setTimeout(() => {
          if (this.currentIndex < (this.frames.length - 1)) {
            this.nextFrame();
            this.play();
          } else if (this.loop) {
            this.currentIndex = 0;
            this.play();
          } else {
            this.playing = false;
          }
        }, this.time);
      }
    },
    prevFrame() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
      }
    },
    reset() {
      this.frames = [];
      this.currentIndex = -1;
      this.addFrame();
    }
  },
  watch: {
    bitmapString() {
      let array = [];
      let arrayY = [];
      for (let i = 0; i < this.bitmapString.length; i += 1) {
        let char = this.bitmapString.charAt(i);
        if (char === '{' || char === '}' || char === ' ' || char === '\n' || char === 'B') {
          continue;
        }
        if (char === ',') {
          arrayY.push(array);
          array = [];
          continue;
        }
        array.push(Number(char));
      }
      //Push last row on 
      arrayY.push(array);

      if (arrayY !== this.display) {
        this.frames[this.currentFrame] = arrayY;
        this.width = array.length;
        this.height = arrayY.length;
      }
    },
    currentIndex() {
      this.bitmapString = this.frameDisplay(this.currentIndex);
    },
    frames() {
      this.bitmapString = this.frameDisplay(this.currentIndex);

      let string = "{";
      for (let i = 0; i < this.frames.length; i += 1) {
        string += this.frameDisplay(i);
        if (i !== this.frames.length - 1) {
          string += ","
        } else {//Last sub-array
          string += "}"
        }
      }

      this.bitmapFramesString = string;
    },
    width() {
      this.reset();
    },
    height() {
      this.reset();
    }
  },
  created() {
    this.addFrame();
  },
  computed: {
    currentFrame() {
      return this.frames[this.currentIndex];
    }
  }
});
