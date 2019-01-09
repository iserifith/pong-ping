const app = new Vue({
  el: '#app',
  data: {
    user: {
      x: 0,
      y: document.getElementById('cvs').height / 2 - 100 / 2,
      width: 10,
      height: 100,
      color: '#fff',
      score: 0
    },
    ai: {
      x: document.getElementById('cvs').width - 10,
      y: document.getElementById('cvs').height / 2 - 100 / 2,
      width: 10,
      height: 100,
      color: '#fff',
      score: 0
    },
    ball: {
      x: document.getElementById('cvs').width / 2,
      y: document.getElementById('cvs').height / 2,
      radius: 10,
      speed: 5,
      velocityX: 5,
      velocityY: 5,
      color: '#fff'
    },
    net: {
      x: document.getElementById('cvs').width / 2 - 1,
      y: 0,
      width: 2,
      height: 10,
      color: '#fff'
    },
    canvas: '#000'
  },
  methods: {
    drawRect(x, y, w, h, color) {
      document.getElementById('cvs').getContext('2d').fillStyle = color;
      document
        .getElementById('cvs')
        .getContext('2d')
        .fillRect(x, y, w, h);
    },
    drawcircle(x, y, r, color) {
      document.getElementById('cvs').getContext('2d').fillStyle = color;
      document
        .getElementById('cvs')
        .getContext('2d')
        .beginPath();
      document
        .getElementById('cvs')
        .getContext('2d')
        .arc(x, y, r, 0, Math.PI * 2, false);
      document
        .getElementById('cvs')
        .getContext('2d')
        .closePath();
      document
        .getElementById('cvs')
        .getContext('2d')
        .fill();
    },
    drawText(text, x, y, color) {
      document.getElementById('cvs').getContext('2d').fillStyle = color;
      document.getElementById('cvs').getContext('2d').font = '45px fantasy';
      document
        .getElementById('cvs')
        .getContext('2d')
        .fillText(text, x, y);
    },
    drawNet() {
      for (let i = 0; i <= document.getElementById('cvs').height; i += 15) {
        this.drawRect(
          this.net.x,
          this.net.y + i,
          this.net.width,
          this.net.height,
          this.net.color
        );
      }
    },
    render() {
      this.drawRect(
        0,
        0,
        document.getElementById('cvs').width,
        document.getElementById('cvs').height,
        this.canvas
      );
      this.drawNet();
      this.drawText(
        this.user.score,
        document.getElementById('cvs').width / 4,
        document.getElementById('cvs').height / 5,
        '#fff'
      );
      this.drawText(
        this.ai.score,
        (3 * document.getElementById('cvs').width) / 4,
        document.getElementById('cvs').height / 5,
        '#fff'
      );
      this.drawRect(
        this.user.x,
        this.user.y,
        this.user.width,
        this.user.height,
        this.user.color
      );
      this.drawRect(
        this.ai.x,
        this.ai.y,
        this.ai.width,
        this.ai.height,
        this.ai.color
      );
      this.drawcircle(
        this.ball.x,
        this.ball.y,
        this.ball.radius,
        this.ball.color
      );
    },
    movePaddle(evt) {
      let rect = document.getElementById('cvs').getBoundingClientRect();
      this.user.y = evt.clientY - rect.top - this.user.height;
    },
    collision(b, p) {
      b.top = b.y - b.radius;
      b.bottom = b.y + b.radius;
      b.left = b.x - b.radius;
      b.right = b.x + b.radius;
      p.top = p.y;
      p.bottom = p.y + p.height;
      p.left = p.x;
      p.right = p.x + p.width;
      return (
        b.right > p.left &&
        b.bottom > p.top &&
        b.left < p.right &&
        b.top < b.bottom
      );
    },
    update() {
      this.ball.x += this.ball.velocityX;
      this.ball.y += this.ball.velocityY;
      let computerLevel = 0.1;
      this.ai.y +=
        (this.ball.y - (this.ai.y + this.ai.height / 2)) * computerLevel;
      if (
        this.ball.y + this.ball.radius >
          document.getElementById('cvs').height ||
        this.ball.y - this.ball.radius < 0
      ) {
        this.ball.velocityY = -this.ball.velocityY;
      }
      let player =
        this.ball.x < document.getElementById('cvs').width / 2
          ? this.user
          : this.ai;
      if (this.collision(this.ball, player)) {
        let collidePoint = this.ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = collidePoint * (Math.PI / 4);
        let direction =
          this.ball.x < document.getElementById('cvs').width / 2 ? 1 : -1;
        this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
        this.ball.velocityY = direction * this.ball.speed * Math.sin(angleRad);
        this.ball.speed + 1;
      }
      if (this.ball.x - this.ball.radius < 0) {
        this.ai.score++;
        this.resetBall();
      } else if (
        this.ball.x + this.ball.radius >
        document.getElementById('cvs').width
      ) {
        this.user.score++;
        this.resetBall();
      }
    },
    resetBall() {
      this.ball.x = document.getElementById('cvs').width / 2;
      this.ball.y = document.getElementById('cvs').height / 2;
      this.ball.speed = 5;
      this.ball.velocityX = -this.ball.velocityX;
      this.ball.velocityY = -this.ball.velocityY;
    },
    game() {
      this.render();
      this.update();
    }
  },
  mounted: function() {
    document
      .getElementById('cvs')
      .addEventListener('mousemove', this.movePaddle);
    setInterval(this.game, 1000 / 60);
  }
});
