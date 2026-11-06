/**
 * ALTA - AI Engine & Diagnostic Learning Workflow
 * Powers the 6-Step Logic Building Workflow and the Global AI Assistant Orb
 */

const ALTA_AI = {
  currentProblem: null,
  diagnosticIndex: 0,
  userResponses: [],
  currentFoundationalTaskIndex: 2, // Task 3 is in progress
  unlockedHintStage: 0,
  isOriginalUnlocked: false,

  init: function() {
    this.currentProblem = ALTA_DATA.problemsCatalog[0]; // Two Sum default
    this.setupGlobalAssistant();
  },

  // PAGE 1: Problem Submission
  submitProblem: function(title, description, language, level, url = '') {
    this.currentProblem = {
      id: "custom-" + Date.now(),
      title: title || "Two Sum",
      difficulty: level || "Intermediate",
      description: description || "Find two numbers in nums that add up to target.",
      language: language || "Python",
      url: url,
      diagnosticQuestions: ALTA_DATA.problemsCatalog[0].diagnosticQuestions,
      foundationalTasks: ALTA_DATA.problemsCatalog[0].foundationalTasks,
      progressiveHints: ALTA_DATA.problemsCatalog[0].progressiveHints
    };
    this.diagnosticIndex = 0;
    this.userResponses = [];
    this.unlockedHintStage = 0;
    this.isOriginalUnlocked = false;

    // Transition to Page 2
    ALTA_APP.goToLearnStep(2);
    this.renderDiagnosticStep();
  },

  loadPresetProblem: function(problemId) {
    const found = ALTA_DATA.problemsCatalog.find(p => p.id === problemId);
    if (found) {
      document.getElementById('problemTitleInput').value = found.title;
      document.getElementById('problemDescInput').value = found.description;
    }
  },

  // PAGE 2: Diagnostic Discussion
  renderDiagnosticStep: function() {
    const chatContainer = document.getElementById('diagnosticChatContainer');
    const chipsContainer = document.getElementById('diagnosticChipsContainer');
    const progressBar = document.getElementById('diagnosticProgressBar');
    const progressLabel = document.getElementById('diagnosticProgressLabel');
    if (!chatContainer) return;

    const totalQuestions = this.currentProblem.diagnosticQuestions.length;
    const currentQ = this.currentProblem.diagnosticQuestions[this.diagnosticIndex];

    if (progressBar) progressBar.style.width = `${((this.diagnosticIndex) / totalQuestions) * 100}%`;
    if (progressLabel) progressLabel.textContent = `Diagnostic Question ${this.diagnosticIndex + 1} of ${totalQuestions}`;

    // Append AI Message with typing effect
    this.appendAIMessage(currentQ.aiPrompt, () => {
      // Show chips
      if (chipsContainer) {
        chipsContainer.innerHTML = '';
        currentQ.suggestedAnswers.forEach(ans => {
          const btn = document.createElement('button');
          btn.className = 'text-left text-xs bg-slate-800/80 hover:bg-cyan-950/60 hover:border-cyan-500/50 border border-white/10 rounded-xl p-3 text-slate-200 transition-all';
          btn.innerHTML = `<span class="text-cyan-400 font-bold mr-1">💡</span> ${ans}`;
          btn.onclick = () => this.handleUserResponse(ans);
          chipsContainer.appendChild(btn);
        });
      }
    });
  },

  appendAIMessage: function(text, onComplete) {
    const chatContainer = document.getElementById('diagnosticChatContainer');
    if (!chatContainer) return;

    const msgRow = document.createElement('div');
    msgRow.className = 'flex items-start gap-3';
    msgRow.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg shadow-cyan-500/20">
        AI
      </div>
      <div class="glass-panel p-4 max-w-[85%] rounded-2xl rounded-tl-sm border-cyan-500/20 bg-slate-900/60">
        <p class="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
          <span>ALTA Diagnostic Engine</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </p>
        <p class="text-sm text-slate-200 leading-relaxed diagnostic-typing-text"></p>
      </div>
    `;
    chatContainer.appendChild(msgRow);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Typing effect
    const textTarget = msgRow.querySelector('.diagnostic-typing-text');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < text.length) {
        textTarget.textContent += text[idx];
        idx++;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 12);
  },

  appendUserMessage: function(text) {
    const chatContainer = document.getElementById('diagnosticChatContainer');
    if (!chatContainer) return;

    const msgRow = document.createElement('div');
    msgRow.className = 'flex items-start gap-3 justify-end';
    msgRow.innerHTML = `
      <div class="glass-panel p-4 max-w-[85%] rounded-2xl rounded-tr-sm border-purple-500/30 bg-purple-950/30">
        <p class="text-xs font-bold text-purple-400 mb-1 text-right">You (Alex)</p>
        <p class="text-sm text-slate-200 leading-relaxed">${text}</p>
      </div>
      <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
        AJ
      </div>
    `;
    chatContainer.appendChild(msgRow);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  },

  handleUserResponse: function(answer) {
    this.appendUserMessage(answer);
    this.userResponses.push(answer);
    document.getElementById('diagnosticChipsContainer').innerHTML = '';

    // Update feedback panel
    const feedbackBox = document.getElementById('diagnosticLiveFeedback');
    if (feedbackBox) {
      if (this.diagnosticIndex === 0) {
        feedbackBox.innerHTML = `
          <div class="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl">
            <p class="text-xs font-bold text-cyan-400">Mental Model Detected</p>
            <p class="text-xs text-slate-300 mt-1">Learner understands pair comparison mechanics. Probing algorithmic time trade-offs next.</p>
          </div>
        `;
      } else if (this.diagnosticIndex === 1) {
        feedbackBox.innerHTML = `
          <div class="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
            <p class="text-xs font-bold text-emerald-400">Time Complexity Validated</p>
            <p class="text-xs text-slate-300 mt-1">Identified quadratic scale limitation. Assessing familiarity with Hash Maps and in-memory key indexing.</p>
          </div>
        `;
      }
    }

    this.diagnosticIndex++;
    if (this.diagnosticIndex < this.currentProblem.diagnosticQuestions.length) {
      setTimeout(() => this.renderDiagnosticStep(), 800);
    } else {
      setTimeout(() => this.completeDiagnostic(), 1000);
    }
  },

  completeDiagnostic: function() {
    this.appendAIMessage("Diagnostic complete! I have analyzed your intuitive reasoning. You possess strong brute-force logic, but require foundational practice with Hash Map value-to-index tracking before tackling the full problem.", () => {
      const btn = document.getElementById('diagnosticCompleteAction');
      if (btn) btn.classList.remove('hidden');
    });
  },

  // PAGE 3: Personalized Learning Path
  renderLearningPath: function() {
    const listContainer = document.getElementById('learningPathTasksList');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const tasks = this.currentProblem.foundationalTasks;

    tasks.forEach((task, idx) => {
      const item = document.createElement('div');
      item.className = `glass-panel p-5 border ${
        task.completed 
          ? 'border-emerald-500/40 bg-emerald-950/10' 
          : idx === this.currentFoundationalTaskIndex 
          ? 'border-cyan-500/50 bg-cyan-950/20 ring-1 ring-cyan-500/30' 
          : 'border-white/10 opacity-75'
      }`;

      item.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
              task.completed 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }">
              ${task.completed ? '✓' : `0${idx + 1}`}
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-bold text-slate-100">${task.title}</h4>
                <span class="text-[10px] px-2 py-0.5 rounded-full ${
                  task.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                }">${task.difficulty}</span>
              </div>
              <p class="text-xs text-slate-400 mb-2">${task.description}</p>
              <div class="flex items-center gap-3 text-[11px] text-slate-400">
                <span>🎯 Skill: <strong class="text-slate-200">${task.skill}</strong></span>
                <span>⏱️ ~5 mins</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            ${
              task.completed
                ? '<button onclick="ALTA_AI.openTaskWorkspace(' + idx + ')" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/10">Review</button>'
                : '<button onclick="ALTA_AI.openTaskWorkspace(' + idx + ')" class="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 rounded-lg shadow-lg shadow-cyan-500/20">Practice Now</button>'
            }
            ${
              !task.completed 
                ? '<button onclick="ALTA_AI.promptSkipAdvisory(' + idx + ')" class="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg">Skip</button>'
                : ''
            }
          </div>
        </div>
      `;
      listContainer.appendChild(item);
    });
  },

  promptSkipAdvisory: function(taskIdx) {
    alert("⚠️ Learning Advisory: Skipping a foundational task will NOT award skill mastery or token rewards. ALTA's architecture requires verified evidence of skill mastery before unlocking the original problem. We recommend completing the task!");
  },

  openTaskWorkspace: function(taskIdx) {
    this.currentFoundationalTaskIndex = taskIdx;
    const task = this.currentProblem.foundationalTasks[taskIdx];
    
    // Set UI details
    document.getElementById('workspaceTaskTitle').textContent = task.title;
    document.getElementById('workspaceTaskSkill').textContent = task.skill;
    document.getElementById('workspaceTaskDesc').textContent = task.description;
    document.getElementById('workspaceCodeEditor').value = task.starterCode;
    this.updateEditorLineNumbers();

    // Transition to Page 4
    ALTA_APP.goToLearnStep(4);
  },

  updateEditorLineNumbers: function(editorId = 'workspaceCodeEditor', lineNumbersId = 'workspaceLineNumbers') {
    const editor = document.getElementById(editorId);
    const lineNumbers = document.getElementById(lineNumbersId);
    if (!editor || !lineNumbers) return;
    const lines = editor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: Math.max(lines, 12) }, (_, i) => i + 1).join('<br>');
  },

  runTaskCode: function() {
    const outputConsole = document.getElementById('workspaceConsoleOutput');
    const statusPill = document.getElementById('workspaceTestStatusPill');
    if (!outputConsole) return;

    outputConsole.innerHTML = '<span class="text-cyan-400">⏳ Compiling and executing simulated test cases...</span>';
    
    setTimeout(() => {
      outputConsole.innerHTML = `
        <div class="text-emerald-400 font-mono mb-1">✓ Test Case 1 Passed: [2, 7, 11, 15], target 9 -> Expected [0, 1], Got [0, 1]</div>
        <div class="text-emerald-400 font-mono mb-1">✓ Test Case 2 Passed: [3, 2, 4], target 6 -> Expected [1, 2], Got [1, 2]</div>
        <div class="text-slate-400 font-mono text-[11px] mt-2 border-t border-white/10 pt-2">
          Runtime: 48 ms | Memory: 15.2 MB | Space Complexity: O(N) | Time Complexity: O(N)
        </div>
      `;
      if (statusPill) {
        statusPill.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
        statusPill.textContent = 'All 2 Tests Passed';
      }
    }, 600);
  },

  submitTaskCode: function() {
    const task = this.currentProblem.foundationalTasks[this.currentFoundationalTaskIndex];
    task.completed = true;
    
    // Check if all foundational tasks completed
    const allDone = this.currentProblem.foundationalTasks.every(t => t.completed);
    if (allDone) {
      this.isOriginalUnlocked = true;
    }

    // Award tokens
    ALTA_DATA.user.tokens += 25;
    document.getElementById('userTokenPill').textContent = `🪙 ${ALTA_DATA.user.tokens}`;

    alert(`🎉 Foundational Task Completed! +25 ALTA Tokens awarded for mastering ${task.skill}!`);
    ALTA_APP.goToLearnStep(5);
    this.renderUnlockScreen();
  },

  // PAGE 5: Unlock Screen
  renderUnlockScreen: function() {
    const statusText = document.getElementById('unlockStatusHeading');
    const unlockBtn = document.getElementById('unlockOriginalBtn');
    const tasksDoneCount = this.currentProblem.foundationalTasks.filter(t => t.completed).length;
    const total = this.currentProblem.foundationalTasks.length;

    document.getElementById('unlockTasksRatio').textContent = `${tasksDoneCount} / ${total}`;

    if (this.isOriginalUnlocked) {
      if (statusText) statusText.innerHTML = '<span class="text-emerald-400">🔓 Original Problem Unlocked!</span>';
      if (unlockBtn) {
        unlockBtn.removeAttribute('disabled');
        unlockBtn.className = 'px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105';
      }
    } else {
      if (statusText) statusText.innerHTML = '<span class="text-amber-400">🔒 Prerequisites Remaining</span>';
      if (unlockBtn) {
        unlockBtn.setAttribute('disabled', 'true');
        unlockBtn.className = 'px-8 py-3 rounded-xl font-bold bg-slate-800 text-slate-500 cursor-not-allowed';
      }
    }
  },

  // PAGE 6: Original Problem Solving Workspace
  setupOriginalProblemSolving: function() {
    this.unlockedHintStage = 0;
    this.renderHintsContainer();
    this.updateEditorLineNumbers('originalCodeEditor', 'originalLineNumbers');
  },

  unlockNextHint: function() {
    if (this.unlockedHintStage >= 5) return;
    this.unlockedHintStage++;
    this.renderHintsContainer();
  },

  renderHintsContainer: function() {
    const container = document.getElementById('originalHintsContainer');
    const btn = document.getElementById('unlockHintBtn');
    if (!container) return;

    container.innerHTML = '';
    const hints = this.currentProblem.progressiveHints;

    for (let i = 0; i < this.unlockedHintStage; i++) {
      const hint = hints[i];
      const box = document.createElement('div');
      box.className = 'p-3.5 rounded-xl border border-white/10 bg-slate-900/80 mb-3';
      box.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-cyan-400">Stage ${hint.stage}: ${hint.type}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">${hint.badge}</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">${hint.text}</p>
      `;
      container.appendChild(box);
    }

    if (btn) {
      if (this.unlockedHintStage >= 5) {
        btn.textContent = 'All Hints Revealed';
        btn.setAttribute('disabled', 'true');
        btn.className = 'w-full py-2 text-xs rounded-xl bg-slate-800 text-slate-500 cursor-not-allowed';
      } else {
        const nextHint = hints[this.unlockedHintStage];
        btn.textContent = `Unlock Stage ${this.unlockedHintStage + 1}: ${nextHint.type}`;
        btn.removeAttribute('disabled');
        btn.className = 'w-full py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20';
      }
    }
  },

  runOriginalCode: function() {
    const consoleBox = document.getElementById('originalConsoleOutput');
    if (!consoleBox) return;

    consoleBox.innerHTML = '<span class="text-cyan-400">⚡ Executing solution on test suite...</span>';
    setTimeout(() => {
      consoleBox.innerHTML = `
        <div class="text-emerald-400 font-mono mb-1">✓ Test 1: nums=[2,7,11,15], target=9 -> Output: [0, 1]</div>
        <div class="text-emerald-400 font-mono mb-1">✓ Test 2: nums=[3,2,4], target=6 -> Output: [1, 2]</div>
        <div class="text-emerald-400 font-mono mb-1">✓ Test 3 (Edge Case): nums=[3,3], target=6 -> Output: [0, 1]</div>
        <div class="text-slate-400 font-mono text-[11px] mt-2 border-t border-white/10 pt-2">
          Status: Accepted | Runtime: 52ms (Beats 89%) | Memory: 15.4MB
        </div>
      `;
    }, 500);
  },

  submitOriginalSolution: function() {
    let tokensAwarded = 50;
    if (this.unlockedHintStage === 0) {
      tokensAwarded = 70; // Bonus for hint-free independent solve!
    } else {
      tokensAwarded = Math.max(30, 50 - this.unlockedHintStage * 5);
    }

    ALTA_DATA.user.tokens += tokensAwarded;
    document.getElementById('userTokenPill').textContent = `🪙 ${ALTA_DATA.user.tokens}`;

    alert(`🏆 Congratulations! Original Problem Solved Successfully!\n\n• Hints Used: ${this.unlockedHintStage}/5\n• Tokens Earned: +${tokensAwarded}\n• Independent Solving Rating: ${this.unlockedHintStage === 0 ? '100% (Hint-Free Hero)' : 'High Independence'}\n\nYour progress has been synced to your 90-Day Challenge tracker!`);
    ALTA_APP.navigate('my-progress');
  },

  // Global AI Assistant Orb
  setupGlobalAssistant: function() {
    const orb = document.getElementById('globalAiOrb');
    const panel = document.getElementById('globalAiPanel');
    const closeBtn = document.getElementById('closeAiPanelBtn');
    const sendBtn = document.getElementById('sendAiPromptBtn');
    const input = document.getElementById('globalAiInput');

    if (orb && panel) {
      orb.onclick = () => {
        panel.classList.toggle('hidden');
      };
    }
    if (closeBtn && panel) {
      closeBtn.onclick = () => panel.classList.add('hidden');
    }

    if (sendBtn && input) {
      sendBtn.onclick = () => this.handleGlobalAiMessage();
      input.onkeydown = (e) => {
        if (e.key === 'Enter') this.handleGlobalAiMessage();
      };
    }
  },

  handleGlobalAiMessage: function(customPrompt) {
    const input = document.getElementById('globalAiInput');
    const prompt = customPrompt || (input ? input.value.trim() : '');
    if (!prompt) return;

    if (input) input.value = '';

    const chatBox = document.getElementById('globalAiChatHistory');
    if (!chatBox) return;

    // User message
    const uMsg = document.createElement('div');
    uMsg.className = 'text-right mb-3';
    uMsg.innerHTML = `<span class="inline-block bg-purple-600/30 border border-purple-500/30 text-slate-200 text-xs rounded-xl px-3 py-2">${prompt}</span>`;
    chatBox.appendChild(uMsg);

    // AI Response simulation
    const aiMsg = document.createElement('div');
    aiMsg.className = 'text-left mb-3';
    aiMsg.innerHTML = `
      <div class="inline-block bg-slate-800/80 border border-cyan-500/30 text-slate-200 text-xs rounded-xl p-3 max-w-[90%]">
        <p class="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
          <span>ALTA Assistant</span>
        </p>
        <p class="leading-relaxed">
          ${
            prompt.toLowerCase().includes('edge') 
              ? "Consider negative numbers, zeros, duplicate values, and minimal array length (n=2). If duplicate values exist, ensure your hash map updates don't overwrite required indices before reading them!"
              : prompt.toLowerCase().includes('optimi') 
              ? "A one-pass Hash Map approach provides O(N) time and O(N) auxiliary space. If memory is strictly O(1), sort first and use Two Pointers in O(N log N)."
              : "I am analyzing your current workspace context. Focus on building the logic step-by-step. Break the problem into inputs, invariants, and expected state transformations."
          }
        </p>
      </div>
    `;
    chatBox.appendChild(aiMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};
