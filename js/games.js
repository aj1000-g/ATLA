/**
 * ALTA - Game Zone Logic
 * Playable mini-games: Loop Runner and Array Quest
 */

const ALTA_GAMES = {
  // Loop Runner Game Engine
  loopRunner: {
    canvas: null,
    ctx: null,
    animId: null,
    running: false,
    score: 0,
    lives: 3,
    difficulty: "medium",
    player: { x: 80, y: 180, vy: 0, jumping: false, width: 32, height: 40 },
    obstacles: [],
    crystals: [],
    speed: 4,
    frame: 0,
    targetCrystals: 5,
    collectedCrystals: 0,
    loopParam: { start: 0, end: 10, step: 1 },

    init: function(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.reset();
      this.drawIdle();
    },

    reset: function() {
      this.score = 0;
      this.lives = 3;
      this.collectedCrystals = 0;
      this.frame = 0;
      this.speed = this.difficulty === 'easy' ? 3 : (this.difficulty === 'hard' ? 6 : 4.5);
      this.player = { x: 80, y: 180, vy: 0, jumping: false, width: 32, height: 40 };
      this.obstacles = [];
      this.crystals = [];
      if (this.animId) cancelAnimationFrame(this.animId);
      this.running = false;
      this.updateUI();
    },

    setDifficulty: function(diff) {
      this.difficulty = diff;
      this.reset();
    },

    start: function() {
      if (this.running) return;
      this.reset();
      this.running = true;
      document.getElementById('loopRunnerStartBtn')?.classList.add('hidden');
      document.getElementById('loopRunnerControls')?.classList.remove('hidden');
      this.loop();
    },

    jump: function(power = 12) {
      if (!this.player.jumping) {
        this.player.vy = -power;
        this.player.jumping = true;
      }
    },

    executeLoopJump: function(loopCode) {
      // Loop execution from user logic
      try {
        let step = parseInt(document.getElementById('loopStepInput')?.value || "2");
        this.jump(10 + step * 2);
        this.score += 20;
        this.updateUI();
      } catch (e) {
        this.jump(12);
      }
    },

    loop: function() {
      if (!this.running) return;
      this.frame++;
      this.update();
      this.draw();
      this.animId = requestAnimationFrame(() => this.loop());
    },

    update: function() {
      // Gravity
      this.player.y += this.player.vy;
      this.player.vy += 0.65;
      if (this.player.y >= 180) {
        this.player.y = 180;
        this.player.vy = 0;
        this.player.jumping = false;
      }

      // Spawn obstacles based on loop modulo
      const spawnInterval = this.difficulty === 'hard' ? 100 : 140;
      if (this.frame % spawnInterval === 0) {
        this.obstacles.push({ x: this.canvas.width + 20, y: 185, width: 24, height: 35 });
      }

      // Spawn data crystals
      if (this.frame % 110 === 0) {
        this.crystals.push({ x: this.canvas.width + 20, y: 120, size: 16, collected: false });
      }

      // Move obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= this.speed;

        // Collision check
        if (
          this.player.x < obs.x + obs.width &&
          this.player.x + this.player.width > obs.x &&
          this.player.y < obs.y + obs.height &&
          this.player.y + this.player.height > obs.y
        ) {
          this.obstacles.splice(i, 1);
          this.lives--;
          this.updateUI();
          if (this.lives <= 0) {
            this.gameOver(false);
            return;
          }
        } else if (obs.x < -30) {
          this.obstacles.splice(i, 1);
          this.score += 10;
          this.updateUI();
        }
      }

      // Move crystals
      for (let i = this.crystals.length - 1; i >= 0; i--) {
        const c = this.crystals[i];
        c.x -= this.speed;

        if (
          this.player.x < c.x + c.size &&
          this.player.x + this.player.width > c.x &&
          this.player.y < c.y + c.size &&
          this.player.y + this.player.height > c.y
        ) {
          this.crystals.splice(i, 1);
          this.collectedCrystals++;
          this.score += 50;
          this.updateUI();
          if (this.collectedCrystals >= this.targetCrystals) {
            this.gameOver(true);
            return;
          }
        } else if (c.x < -30) {
          this.crystals.splice(i, 1);
        }
      }
    },

    draw: function() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Cyber Grid Track Background
      ctx.fillStyle = '#0B0D1A';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Floor line with glowing neon gradient
      const floorGrad = ctx.createLinearGradient(0, 220, this.canvas.width, 220);
      floorGrad.addColorStop(0, '#00F2FE');
      floorGrad.addColorStop(0.5, '#A855F7');
      floorGrad.addColorStop(1, '#00F2FE');
      ctx.strokeStyle = floorGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 220);
      ctx.lineTo(this.canvas.width, 220);
      ctx.stroke();

      // Subtle track grid lines moving backwards
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
      ctx.lineWidth = 1;
      const offset = (this.frame * this.speed) % 30;
      for (let x = -offset; x < this.canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 220);
        ctx.lineTo(x - 20, this.canvas.height);
        ctx.stroke();
      }

      // Draw Player (Cyber Runner Avatar)
      ctx.save();
      ctx.fillStyle = '#00F2FE';
      ctx.shadowColor = '#00F2FE';
      ctx.shadowBlur = 15;
      // Head
      ctx.beginPath();
      ctx.arc(this.player.x + 16, this.player.y + 8, 8, 0, Math.PI * 2);
      ctx.fill();
      // Torso
      ctx.fillStyle = '#A855F7';
      ctx.fillRect(this.player.x + 8, this.player.y + 16, 16, 16);
      // Legs
      ctx.fillStyle = '#10B981';
      const legOffset = Math.sin(this.frame * 0.3) * 6;
      ctx.fillRect(this.player.x + 8, this.player.y + 32, 6, 8 + (this.player.jumping ? -4 : legOffset));
      ctx.fillRect(this.player.x + 18, this.player.y + 32, 6, 8 + (this.player.jumping ? -4 : -legOffset));
      ctx.restore();

      // Draw Obstacles (Hurdles)
      ctx.save();
      ctx.fillStyle = '#F43F5E';
      ctx.shadowColor = '#F43F5E';
      ctx.shadowBlur = 12;
      this.obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('ERR', obs.x + 2, obs.y + 18);
        ctx.fillStyle = '#F43F5E';
      });
      ctx.restore();

      // Draw Data Crystals
      ctx.save();
      ctx.fillStyle = '#10B981';
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 14;
      this.crystals.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x + c.size / 2, c.y + c.size / 2, c.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    },

    drawIdle: function() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = '#0B0D1A';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Press "Start Loop Runner" to launch the algorithmic track', this.canvas.width / 2, 110);
      ctx.fillStyle = '#00F2FE';
      ctx.fillText('Execute loops to time jumps and collect 5 Data Crystals!', this.canvas.width / 2, 140);
    },

    updateUI: function() {
      const scoreEl = document.getElementById('loopScoreDisplay');
      const livesEl = document.getElementById('loopLivesDisplay');
      const crystalEl = document.getElementById('loopCrystalsDisplay');
      if (scoreEl) scoreEl.textContent = this.score;
      if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, this.lives));
      if (crystalEl) crystalEl.textContent = `${this.collectedCrystals} / ${this.targetCrystals}`;
    },

    gameOver: function(isVictory) {
      this.running = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      const modal = document.getElementById('gameResultModal');
      const title = document.getElementById('gameResultTitle');
      const msg = document.getElementById('gameResultMsg');
      const tokenEarned = document.getElementById('gameResultTokens');
      
      if (isVictory) {
        title.textContent = '🎉 Victory! Loop Condition Mastered!';
        title.className = 'text-2xl font-bold text-emerald-400 mb-2';
        msg.textContent = `You gathered all ${this.targetCrystals} data crystals with a final score of ${this.score}! Loop traversal logic validated.`;
        tokenEarned.textContent = '+30 ALTA Tokens';
        ALTA_DATA.user.tokens += 30;
        document.getElementById('userTokenPill').textContent = `🪙 ${ALTA_DATA.user.tokens}`;
      } else {
        title.textContent = '💥 Bug Encountered! Loop Terminated';
        title.className = 'text-2xl font-bold text-rose-400 mb-2';
        msg.textContent = `You ran out of lives. Adjust your loop step interval or jump timing and retry!`;
        tokenEarned.textContent = '+5 Tokens (Effort Bonus)';
        ALTA_DATA.user.tokens += 5;
        document.getElementById('userTokenPill').textContent = `🪙 ${ALTA_DATA.user.tokens}`;
      }

      modal?.classList.remove('hidden');
      document.getElementById('loopRunnerStartBtn')?.classList.remove('hidden');
      document.getElementById('loopRunnerControls')?.classList.add('hidden');
    }
  },

  // Array Quest Game Engine
  arrayQuest: {
    array: [12, 4, 9, 2, 15, 7, 1],
    leftPointer: 0,
    rightPointer: 6,
    moves: 0,
    targetDesc: "Reverse the array using two pointers (Swap L and R, then move inwards)",
    missionType: "reverse",
    completed: false,

    init: function() {
      this.reset();
      this.render();
    },

    reset: function() {
      this.array = [12, 4, 9, 2, 15, 7, 1];
      this.leftPointer = 0;
      this.rightPointer = this.array.length - 1;
      this.moves = 0;
      this.completed = false;
      this.render();
    },

    moveLeft: function() {
      if (this.leftPointer < this.rightPointer) {
        this.leftPointer++;
        this.moves++;
        this.render();
      }
    },

    moveRight: function() {
      if (this.rightPointer > this.leftPointer) {
        this.rightPointer--;
        this.moves++;
        this.render();
      }
    },

    swapPointers: function() {
      const temp = this.array[this.leftPointer];
      this.array[this.leftPointer] = this.array[this.rightPointer];
      this.array[this.rightPointer] = temp;
      this.moves++;
      this.render();
      this.checkVictory();
    },

    checkVictory: function() {
      const expected = [1, 7, 15, 2, 9, 4, 12];
      const isReversed = this.array.every((val, idx) => val === expected[idx]);
      if (isReversed && !this.completed) {
        this.completed = true;
        setTimeout(() => {
          const modal = document.getElementById('gameResultModal');
          const title = document.getElementById('gameResultTitle');
          const msg = document.getElementById('gameResultMsg');
          const tokenEarned = document.getElementById('gameResultTokens');
          title.textContent = '🌟 Array Quest Cleared!';
          title.className = 'text-2xl font-bold text-cyan-400 mb-2';
          msg.textContent = `Two-pointer in-place reversal completed flawlessly in ${this.moves} moves! O(1) auxiliary space achieved.`;
          tokenEarned.textContent = '+35 ALTA Tokens';
          ALTA_DATA.user.tokens += 35;
          document.getElementById('userTokenPill').textContent = `🪙 ${ALTA_DATA.user.tokens}`;
          modal?.classList.remove('hidden');
        }, 300);
      }
    },

    render: function() {
      const container = document.getElementById('arrayQuestContainer');
      if (!container) return;
      container.innerHTML = '';

      this.array.forEach((val, idx) => {
        const isLeft = idx === this.leftPointer;
        const isRight = idx === this.rightPointer;
        
        const cell = document.createElement('div');
        cell.className = `flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
          isLeft && isRight 
            ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-500/20'
            : isLeft 
            ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20'
            : isRight 
            ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-500/20'
            : 'border-white/10 bg-white/5'
        }`;

        cell.innerHTML = `
          <span class="text-xs font-mono text-slate-400 mb-1">Index [${idx}]</span>
          <span class="text-2xl font-bold text-white">${val}</span>
          <div class="h-6 flex items-center gap-1 mt-2">
            ${isLeft ? '<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">PTR L</span>' : ''}
            ${isRight ? '<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PTR R</span>' : ''}
          </div>
        `;

        container.appendChild(cell);
      });

      const moveEl = document.getElementById('arrayQuestMoves');
      if (moveEl) moveEl.textContent = this.moves;
    }
  }
};
