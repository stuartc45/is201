
const setupSection = document.getElementById("setup");
const gameSection = document.getElementById("game");
const playerCountSelect = document.getElementById("playerCount");
const playerInputs = document.getElementById("playerInputs");
const startGameBtn = document.getElementById("startGame");
const playersArea = document.getElementById("playersArea");
const turnInfo = document.getElementById("turnInfo");
const drawBtn = document.getElementById("drawBtn");
const endTurnBtn = document.getElementById("endTurnBtn");
const deckCount = document.getElementById("deckCount");
const discardCount = document.getElementById("discardCount");
const discardTop = document.getElementById("discardTop");
const logEl = document.getElementById("log");
const gameStatus = document.getElementById("gameStatus");
const peekDeckBtn = document.getElementById("peekDeck");
const deckPeek = document.getElementById("deckPeek");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCancel = document.getElementById("modalCancel");

const COLORS = [
  "Brown",
  "Light Blue",
  "Purple",
  "Orange",
  "Red",
  "Yellow",
  "Green",
  "Dark Blue",
  "Railroad",
  "Utility",
];

const SET_SIZES = {
  "Brown": 2,
  "Light Blue": 3,
  "Purple": 3,
  "Orange": 3,
  "Red": 3,
  "Yellow": 3,
  "Green": 3,
  "Dark Blue": 2,
  "Railroad": 4,
  "Utility": 2,
};

const RENT_TABLE = {
  "Brown": [1, 2],
  "Light Blue": [1, 2, 3],
  "Purple": [1, 2, 4],
  "Orange": [1, 3, 5],
  "Red": [2, 3, 6],
  "Yellow": [2, 4, 6],
  "Green": [2, 4, 7],
  "Dark Blue": [3, 8],
  "Utility": [1, 2],
  "Railroad": [1, 2, 3, 4],
};

let state = null;

function initPlayerInputs() {
  const count = Number(playerCountSelect.value);
  playerInputs.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const wrapper = document.createElement("div");
    wrapper.className = "row";
    const label = document.createElement("label");
    label.textContent = `Player ${i + 1}`;
    label.setAttribute("for", `player-${i}`);
    const input = document.createElement("input");
    input.type = "text";
    input.id = `player-${i}`;
    input.placeholder = `Name ${i + 1}`;
    input.value = `Player ${i + 1}`;
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    playerInputs.appendChild(wrapper);
  }
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDeck() {
  let id = 1;
  const deck = [];

  function addCard(card, count = 1) {
    for (let i = 0; i < count; i += 1) {
      deck.push({ id: id++, ...card });
    }
  }

  // Action cards
  addCard({ name: "Deal Breaker", type: "action", value: 5 }, 2);
  addCard({ name: "Just Say No", type: "action", value: 4 }, 3);
  addCard({ name: "Sly Deal", type: "action", value: 3 }, 3);
  addCard({ name: "Forced Deal", type: "action", value: 3 }, 4);
  addCard({ name: "Debt Collector", type: "action", value: 3 }, 3);
  addCard({ name: "It's My Birthday", type: "action", value: 2 }, 3);
  addCard({ name: "Pass Go", type: "action", value: 1 }, 10);
  addCard({ name: "House", type: "action", value: 3 }, 3);
  addCard({ name: "Hotel", type: "action", value: 4 }, 3);
  addCard({ name: "Double The Rent", type: "action", value: 1 }, 2);

  // Property cards (values guessed from standard Monopoly Deal)
  addCard({ name: "Green Property", type: "property", colors: ["Green"], value: 4 }, 3);
  addCard({ name: "Dark Blue Property", type: "property", colors: ["Dark Blue"], value: 4 }, 3);
  addCard({ name: "Light Blue Property", type: "property", colors: ["Light Blue"], value: 1 }, 3);
  addCard({ name: "Red Property", type: "property", colors: ["Red"], value: 3 }, 3);
  addCard({ name: "Utility Property", type: "property", colors: ["Utility"], value: 2 }, 2);
  addCard({ name: "Yellow Property", type: "property", colors: ["Yellow"], value: 3 }, 3);
  addCard({ name: "Orange Property", type: "property", colors: ["Orange"], value: 2 }, 3);
  addCard({ name: "Brown Property", type: "property", colors: ["Brown"], value: 1 }, 2);
  addCard({ name: "Purple Property", type: "property", colors: ["Purple"], value: 2 }, 3);
  addCard({ name: "Railroad Property", type: "property", colors: ["Railroad"], value: 1 }, 4);

  // Property wildcards
  addCard({ name: "Purple/Orange Wild", type: "wild", colors: ["Purple", "Orange"], value: 2 }, 2);
  addCard({ name: "Light Blue/Brown Wild", type: "wild", colors: ["Light Blue", "Brown"], value: 1 }, 1);
  addCard({ name: "Light Blue/Railroad Wild", type: "wild", colors: ["Light Blue", "Railroad"], value: 2 }, 1);
  addCard({ name: "Dark Blue/Green Wild", type: "wild", colors: ["Dark Blue", "Green"], value: 4 }, 1);
  addCard({ name: "Railroad/Green Wild", type: "wild", colors: ["Railroad", "Green"], value: 2 }, 1);
  addCard({ name: "Red/Yellow Wild", type: "wild", colors: ["Red", "Yellow"], value: 3 }, 2);
  addCard({ name: "Utility/Railroad Wild", type: "wild", colors: ["Utility", "Railroad"], value: 2 }, 1);
  addCard({ name: "Ten Color Wild", type: "wild", colors: COLORS, value: 4 }, 2);

  // Rent cards
  addCard({ name: "Purple/Orange Rent", type: "rent", colors: ["Purple", "Orange"], value: 1 }, 2);
  addCard({ name: "Railroad/Utility Rent", type: "rent", colors: ["Railroad", "Utility"], value: 1 }, 2);
  addCard({ name: "Green/Dark Blue Rent", type: "rent", colors: ["Green", "Dark Blue"], value: 1 }, 2);
  addCard({ name: "Brown/Light Blue Rent", type: "rent", colors: ["Brown", "Light Blue"], value: 1 }, 2);
  addCard({ name: "Red/Yellow Rent", type: "rent", colors: ["Red", "Yellow"], value: 1 }, 2);
  addCard({ name: "Ten Color Rent", type: "rent", colors: COLORS, value: 1 }, 3);

  // Money cards
  addCard({ name: "$10M", type: "money", value: 10 }, 1);
  addCard({ name: "$5M", type: "money", value: 5 }, 2);
  addCard({ name: "$4M", type: "money", value: 4 }, 3);
  addCard({ name: "$3M", type: "money", value: 3 }, 3);
  addCard({ name: "$2M", type: "money", value: 2 }, 5);
  addCard({ name: "$1M", type: "money", value: 1 }, 6);

  return shuffle(deck);
}

function startGame() {
  const count = Number(playerCountSelect.value);
  const players = [];
  for (let i = 0; i < count; i += 1) {
    const input = document.getElementById(`player-${i}`);
    const name = input.value.trim() || `Player ${i + 1}`;
    players.push({
      name,
      hand: [],
      bank: [],
      properties: createEmptyProperties(),
      buildings: createEmptyBuildings(),
      completedSets: 0,
    });
  }

  const deck = createDeck();
  const discard = [];

  for (let i = 0; i < 5; i += 1) {
    players.forEach((player) => {
      if (deck.length > 0) player.hand.push(deck.pop());
    });
  }

  state = {
    players,
    deck,
    discard,
    currentPlayerIndex: 0,
    actionsRemaining: 3,
    hasDrawn: false,
    log: [],
  };

  setupSection.classList.add("hidden");
  gameSection.classList.remove("hidden");

  logAction("Game started. Each player drew 5 cards.");
  render();
}

function createEmptyProperties() {
  const props = {};
  COLORS.forEach((color) => {
    props[color] = [];
  });
  return props;
}

function createEmptyBuildings() {
  const buildings = {};
  COLORS.forEach((color) => {
    buildings[color] = { house: false, hotel: false };
  });
  return buildings;
}

function drawCards(count) {
  const player = currentPlayer();
  for (let i = 0; i < count; i += 1) {
    if (state.deck.length === 0) {
      if (state.discard.length === 0) return;
      state.deck = shuffle(state.discard);
      state.discard = [];
      logAction("Deck reshuffled from discard.");
    }
    player.hand.push(state.deck.pop());
  }
}

function currentPlayer() {
  return state.players[state.currentPlayerIndex];
}

function render() {
  if (!state) return;
  deckCount.textContent = `${state.deck.length} cards`;
  discardCount.textContent = `${state.discard.length} cards`;
  discardTop.textContent = state.discard.length
    ? `${state.discard[state.discard.length - 1].name}`
    : "Empty";

  const player = currentPlayer();
  turnInfo.textContent = `${player.name}'s turn · Actions left: ${state.actionsRemaining}`;
  gameStatus.textContent = state.hasDrawn ? "Ready" : "Need to draw";

  renderPlayers();
  renderLog();
}

function renderPlayers() {
  playersArea.innerHTML = "";
  state.players.forEach((player, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = `player${index === state.currentPlayerIndex ? " active" : ""}`;

    const header = document.createElement("h3");
    header.textContent = player.name;
    wrapper.appendChild(header);

    const handSection = document.createElement("div");
    handSection.className = "player-section";
    handSection.appendChild(makeSectionTitle(`Hand (${player.hand.length})`));
    handSection.appendChild(renderHand(player, index === state.currentPlayerIndex));

    const bankSection = document.createElement("div");
    bankSection.className = "player-section";
    bankSection.appendChild(makeSectionTitle(`Bank (${bankTotal(player)}M)`));
    bankSection.appendChild(renderCardList(player.bank));

    const propSection = document.createElement("div");
    propSection.className = "player-section";
    propSection.appendChild(makeSectionTitle("Properties"));
    propSection.appendChild(renderProperties(player, index === state.currentPlayerIndex));

    wrapper.appendChild(handSection);
    wrapper.appendChild(bankSection);
    wrapper.appendChild(propSection);

    playersArea.appendChild(wrapper);
  });
}

function makeSectionTitle(text) {
  const title = document.createElement("div");
  title.className = "section-title";
  title.textContent = text;
  return title;
}

function renderHand(player, isActive) {
  const list = document.createElement("div");
  list.className = "card-list";
  if (!player.hand.length) {
    const empty = document.createElement("div");
    empty.textContent = "No cards";
    empty.className = "muted";
    list.appendChild(empty);
    return list;
  }

  player.hand.forEach((card, idx) => {
    const cardEl = document.createElement("button");
    cardEl.type = "button";
    cardEl.className = `card ${cardClass(card)}`;
    cardEl.textContent = cardLabel(card);
    if (!isActive) {
      cardEl.disabled = true;
    } else {
      cardEl.addEventListener("click", () => handleCardPlay(idx));
    }
    list.appendChild(cardEl);
  });

  return list;
}
function renderCardList(cards) {
  const list = document.createElement("div");
  list.className = "card-list";
  if (!cards.length) {
    list.textContent = "Empty";
    return list;
  }
  cards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = `card ${cardClass(card)}`;
    cardEl.textContent = cardLabel(card);
    list.appendChild(cardEl);
  });
  return list;
}

function renderProperties(player, isActive) {
  const grid = document.createElement("div");
  grid.className = "property-grid";
  let completed = 0;

  COLORS.forEach((color) => {
    const set = document.createElement("div");
    const count = player.properties[color].length;
    const target = SET_SIZES[color];
    const isComplete = count >= target;
    if (isComplete) completed += 1;

    set.className = `property-set${isComplete ? " complete" : ""}`;
    const title = document.createElement("h4");
    title.textContent = color;
    const countEl = document.createElement("div");
    countEl.className = "count";
    countEl.textContent = `${count}/${target}`;

    const buildingEl = document.createElement("div");
    buildingEl.className = "count";
    const buildings = player.buildings[color];
    const buildingParts = [];
    if (buildings.house) buildingParts.push("House");
    if (buildings.hotel) buildingParts.push("Hotel");
    buildingEl.textContent = buildingParts.length ? buildingParts.join(" + ") : "No buildings";

    const list = document.createElement("div");
    list.className = "card-list";
    player.properties[color].forEach((card) => {
      if (isActive && card.type === "wild" && !isComplete) {
        const cardBtn = document.createElement("button");
        cardBtn.type = "button";
        cardBtn.className = `card ${cardClass(card)}`;
        cardBtn.textContent = `${cardLabel(card)} (move)`;
        cardBtn.addEventListener("click", () => moveWild(card, color));
        list.appendChild(cardBtn);
      } else {
        const cardEl = document.createElement("div");
        cardEl.className = `card ${cardClass(card)}`;
        cardEl.textContent = cardLabel(card);
        list.appendChild(cardEl);
      }
    });

    set.appendChild(title);
    set.appendChild(countEl);
    set.appendChild(buildingEl);
    set.appendChild(list);
    grid.appendChild(set);
  });

  player.completedSets = completed;
  checkWin();

  return grid;
}

function checkWin() {
  const winner = state.players.find((p) => p.completedSets >= 3);
  if (winner) {
    gameStatus.textContent = `${winner.name} has 3 complete sets!`;
  }
}

function cardClass(card) {
  if (card.type === "money") return "money";
  if (card.type === "property") return "property";
  if (card.type === "rent") return "rent";
  if (card.type === "wild") return "wild";
  return "action";
}

function cardLabel(card) {
  if (card.type === "money") return `${card.name}`;
  if (card.type === "property" || card.type === "wild") {
    const base = card.assignedColor ? `${card.name} -> ${card.assignedColor}` : card.name;
    return card.value ? `${base} ($${card.value}M)` : base;
  }
  if (card.value) return `${card.name} ($${card.value}M)`;
  return card.name;
}

function bankTotal(player) {
  return player.bank.reduce((sum, card) => sum + (card.value || 0), 0);
}

function getCardValue(card) {
  if (typeof card.value === "number") return card.value;
  return 1;
}

function handleCardPlay(handIndex) {
  if (state.actionsRemaining <= 0) {
    logAction("No actions remaining.");
    return;
  }
  const player = currentPlayer();
  const card = player.hand[handIndex];
  if (!card) return;

  if (card.type === "money") {
    player.bank.push(card);
    player.hand.splice(handIndex, 1);
    state.actionsRemaining -= 1;
    logAction(`${player.name} banked ${card.name}.`);
    render();
    return;
  }

  showPlayOptions(card, handIndex);
}

function showPlayOptions(card, handIndex) {
  modalTitle.textContent = `Play: ${card.name}`;
  modalBody.innerHTML = "";

  const info = document.createElement("p");
  info.textContent = "Choose how to play this card.";
  modalBody.appendChild(info);

  const actions = document.createElement("div");
  actions.className = "card-list";

  if (card.type === "property" || card.type === "wild") {
    const propBtn = document.createElement("button");
    propBtn.textContent = "Add to Properties";
    propBtn.addEventListener("click", () => {
      selectPropertyColor(card, handIndex);
    });
    actions.appendChild(propBtn);
  }

  if (card.type === "rent" || card.type === "action") {
    const actionBtn = document.createElement("button");
    actionBtn.textContent = "Play Action";
    actionBtn.addEventListener("click", () => {
      playAction(card, handIndex);
    });
    actions.appendChild(actionBtn);
  }

  if (card.value) {
    const bankBtn = document.createElement("button");
    bankBtn.textContent = `Bank for $${card.value}M`;
    bankBtn.addEventListener("click", () => {
      bankCard(card, handIndex);
    });
    actions.appendChild(bankBtn);
  }

  const discardBtn = document.createElement("button");
  discardBtn.textContent = "Discard";
  discardBtn.addEventListener("click", () => {
    discardCard(card, handIndex);
  });
  actions.appendChild(discardBtn);

  modalBody.appendChild(actions);
  openModal();
}

function bankCard(card, handIndex) {
  const player = currentPlayer();
  player.bank.push(card);
  player.hand.splice(handIndex, 1);
  state.actionsRemaining -= 1;
  logAction(`${player.name} banked ${card.name}.`);
  closeModal();
  render();
}

function selectPropertyColor(card, handIndex) {
  modalTitle.textContent = `Choose set for ${card.name}`;
  modalBody.innerHTML = "";
  const info = document.createElement("p");
  info.textContent = "Pick a color set for this card.";
  modalBody.appendChild(info);

  const actions = document.createElement("div");
  actions.className = "card-list";

  const colors = card.colors || [];
  colors.forEach((color) => {
    const btn = document.createElement("button");
    btn.textContent = color;
    btn.addEventListener("click", () => {
      placeProperty(card, handIndex, color);
    });
    actions.appendChild(btn);
  });

  modalBody.appendChild(actions);
  openModal();
}

function placeProperty(card, handIndex, color) {
  const player = currentPlayer();
  const placed = { ...card, assignedColor: color };
  player.properties[color].push(placed);
  player.hand.splice(handIndex, 1);
  state.actionsRemaining -= 1;
  logAction(`${player.name} added ${card.name} to ${color}.`);
  closeModal();
  render();
}

function playAction(card, handIndex) {
  const player = currentPlayer();
  player.hand.splice(handIndex, 1);
  state.actionsRemaining -= 1;

  switch (card.name) {
    case "Pass Go":
      drawCards(2);
      state.discard.push(card);
      logAction(`${player.name} played Pass Go and drew 2 cards.`);
      closeModal();
      render();
      return;
    case "Debt Collector":
      state.discard.push(card);
      closeModal();
      chooseTargetPlayer("Collect $5M from", (targetIndex) => {
        offerJustSayNo(targetIndex, card, () => {
          collectPayment(targetIndex, state.currentPlayerIndex, 5, "Debt Collector", () => {
            logAction(`${player.name} collected $5M from ${state.players[targetIndex].name}.`);
            render();
          });
        });
      });
      return;
    case "It's My Birthday":
      state.discard.push(card);
      closeModal();
      collectFromAll(2, "Birthday", () => {
        logAction(`${player.name} collected $2M from each player.`);
        render();
      });
      return;
    case "Sly Deal":
      state.discard.push(card);
      closeModal();
      slyDeal();
      return;
    case "Forced Deal":
      state.discard.push(card);
      closeModal();
      forcedDeal();
      return;
    case "Deal Breaker":
      state.discard.push(card);
      closeModal();
      dealBreaker();
      return;
    case "House":
      closeModal();
      placeHouse(card);
      return;
    case "Hotel":
      closeModal();
      placeHotel(card);
      return;
    case "Double The Rent":
      closeModal();
      doubleTheRent(card);
      return;
    default:
      if (card.type === "rent") {
        state.discard.push(card);
        closeModal();
        playRent(card, 1);
        return;
      }
      state.discard.push(card);
      logAction(`${player.name} played ${card.name}.`);
      closeModal();
      render();
  }
}

function discardCard(card, handIndex) {
  const player = currentPlayer();
  state.discard.push(card);
  player.hand.splice(handIndex, 1);
  state.actionsRemaining -= 1;
  logAction(`${player.name} discarded ${card.name}.`);
  closeModal();
  render();
}

function logAction(text) {
  state.log.unshift({ id: Date.now() + Math.random(), text });
  if (state.log.length > 40) state.log.pop();
}

function renderLog() {
  logEl.innerHTML = "";
  state.log.forEach((item) => {
    const row = document.createElement("div");
    row.className = "log-item";
    row.textContent = item.text;
    logEl.appendChild(row);
  });
}

function openModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}
function chooseTargetPlayer(title, onSelect) {
  modalTitle.textContent = title;
  modalBody.innerHTML = "";
  const actions = document.createElement("div");
  actions.className = "card-list";

  state.players.forEach((player, index) => {
    if (index === state.currentPlayerIndex) return;
    const btn = document.createElement("button");
    btn.textContent = player.name;
    btn.addEventListener("click", () => {
      closeModal();
      onSelect(index);
    });
    actions.appendChild(btn);
  });

  if (!actions.children.length) {
    const msg = document.createElement("div");
    msg.textContent = "No valid targets.";
    modalBody.appendChild(msg);
  } else {
    modalBody.appendChild(actions);
  }
  openModal();
}

function collectPayment(fromIndex, toIndex, amount, reason, onDone) {
  const fromPlayer = state.players[fromIndex];
  const toPlayer = state.players[toIndex];

  const eligibleProperties = [];
  COLORS.forEach((color) => {
    const hasBuildings = fromPlayer.buildings[color].house || fromPlayer.buildings[color].hotel;
    if (hasBuildings) return;
    const isComplete = fromPlayer.properties[color].length >= SET_SIZES[color];
    fromPlayer.properties[color].forEach((card) => {
      if (!isComplete) eligibleProperties.push({ card, color });
    });
  });

  const options = [
    ...fromPlayer.bank.map((card) => ({ card, location: "bank" })),
    ...eligibleProperties.map((item) => ({ card: item.card, location: item.color })),
  ];

  if (options.length === 0) {
    logAction(`${fromPlayer.name} cannot pay and is broke.`);
    if (onDone) onDone();
    return;
  }

  modalTitle.textContent = `Pay $${amount}M to ${toPlayer.name}`;
  modalBody.innerHTML = "";
  const info = document.createElement("p");
  info.textContent = `Select cards to pay for ${reason}. Overpay is allowed.`;
  modalBody.appendChild(info);

  let selectedTotal = 0;
  const selected = new Set();
  const list = document.createElement("div");
  list.className = "card-list";

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `card ${cardClass(opt.card)}`;
    btn.textContent = `${cardLabel(opt.card)} (${opt.location})`;
    btn.addEventListener("click", () => {
      if (selected.has(opt.card.id)) {
        selected.delete(opt.card.id);
        selectedTotal -= getCardValue(opt.card);
        btn.classList.remove("selected");
      } else {
        selected.add(opt.card.id);
        selectedTotal += getCardValue(opt.card);
        btn.classList.add("selected");
      }
      totalEl.textContent = `Selected: $${selectedTotal}M`;
    });
    list.appendChild(btn);
  });

  const totalEl = document.createElement("div");
  totalEl.className = "count";
  totalEl.textContent = `Selected: $${selectedTotal}M`;

  const payBtn = document.createElement("button");
  payBtn.textContent = "Pay";
  payBtn.addEventListener("click", () => {
    if (selected.size === 0) return;
    const selectedCards = options.filter((opt) => selected.has(opt.card.id));
    selectedCards.forEach((opt) => {
      if (opt.location === "bank") {
        removeCard(fromPlayer.bank, opt.card.id);
        toPlayer.bank.push(opt.card);
      } else {
        removeCard(fromPlayer.properties[opt.location], opt.card.id);
        toPlayer.properties[opt.card.assignedColor || opt.location].push(opt.card);
      }
    });
    closeModal();
    if (onDone) onDone();
  });

  modalBody.appendChild(list);
  modalBody.appendChild(totalEl);
  modalBody.appendChild(payBtn);
  openModal();
}

function removeCard(list, id) {
  const idx = list.findIndex((card) => card.id === id);
  if (idx >= 0) list.splice(idx, 1);
}

function collectFromAll(amount, reason, onDone) {
  const targets = state.players
    .map((_, idx) => idx)
    .filter((idx) => idx !== state.currentPlayerIndex);

  function next() {
    if (!targets.length) {
      if (onDone) onDone();
      return;
    }
    const target = targets.shift();
    offerJustSayNo(target, { name: reason }, () => {
      collectPayment(target, state.currentPlayerIndex, amount, reason, () => {
        next();
      });
    }, () => {
      next();
    });
  }

  next();
}

function offerJustSayNo(targetIndex, card, onProceed, onCancel) {
  const target = state.players[targetIndex];
  const jsnIndex = target.hand.findIndex((c) => c.name === "Just Say No");
  if (jsnIndex === -1) {
    onProceed();
    return;
  }

  modalTitle.textContent = `${target.name}: Just Say No?`;
  modalBody.innerHTML = "";
  const info = document.createElement("p");
  info.textContent = `${card.name} was played against you. Cancel it?`;
  modalBody.appendChild(info);

  const actions = document.createElement("div");
  actions.className = "card-list";

  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Play Just Say No";
  yesBtn.addEventListener("click", () => {
    const jsnCard = target.hand.splice(jsnIndex, 1)[0];
    state.discard.push(jsnCard);
    logAction(`${target.name} canceled with Just Say No.`);
    closeModal();
    if (onCancel) onCancel();
  });
  actions.appendChild(yesBtn);

  const noBtn = document.createElement("button");
  noBtn.textContent = "Let it happen";
  noBtn.addEventListener("click", () => {
    closeModal();
    onProceed();
  });
  actions.appendChild(noBtn);

  modalBody.appendChild(actions);
  openModal();
}

function slyDeal() {
  const candidates = state.players
    .map((p, idx) => ({ player: p, idx }))
    .filter((entry) => entry.idx !== state.currentPlayerIndex)
    .filter((entry) => hasStealableProperty(entry.player));

  if (!candidates.length) {
    logAction("No valid targets for Sly Deal.");
    render();
    return;
  }

  chooseTargetPlayer("Sly Deal target", (targetIndex) => {
    offerJustSayNo(targetIndex, { name: "Sly Deal" }, () => {
      choosePropertyFromPlayer(targetIndex, false, (color, card) => {
        transferProperty(targetIndex, state.currentPlayerIndex, color, card);
        logAction(`${currentPlayer().name} stole a property from ${state.players[targetIndex].name}.`);
        render();
      });
    }, () => render());
  });
}

function forcedDeal() {
  const current = currentPlayer();
  if (!hasStealableProperty(current)) {
    logAction("You have no eligible properties to swap.");
    render();
    return;
  }

  chooseTargetPlayer("Forced Deal target", (targetIndex) => {
    const target = state.players[targetIndex];
    if (!hasStealableProperty(target)) {
      logAction("Target has no eligible properties to swap.");
      render();
      return;
    }
    offerJustSayNo(targetIndex, { name: "Forced Deal" }, () => {
      choosePropertyFromPlayer(state.currentPlayerIndex, false, (myColor, myCard) => {
        choosePropertyFromPlayer(targetIndex, false, (theirColor, theirCard) => {
          transferProperty(state.currentPlayerIndex, targetIndex, myColor, myCard);
          transferProperty(targetIndex, state.currentPlayerIndex, theirColor, theirCard);
          logAction(`${current.name} swapped properties with ${target.name}.`);
          render();
        });
      });
    }, () => render());
  });
}

function dealBreaker() {
  const candidates = state.players
    .map((p, idx) => ({ player: p, idx }))
    .filter((entry) => entry.idx !== state.currentPlayerIndex)
    .filter((entry) => completeSets(entry.player).length > 0);

  if (!candidates.length) {
    logAction("No complete sets to steal.");
    render();
    return;
  }

  chooseTargetPlayer("Deal Breaker target", (targetIndex) => {
    offerJustSayNo(targetIndex, { name: "Deal Breaker" }, () => {
      chooseCompleteSet(targetIndex, (color) => {
        stealSet(targetIndex, state.currentPlayerIndex, color);
        logAction(`${currentPlayer().name} stole the ${color} set from ${state.players[targetIndex].name}.`);
        render();
      });
    }, () => render());
  });
}
function placeHouse(card) {
  const player = currentPlayer();
  const validColors = COLORS.filter((color) => {
    if (color === "Railroad" || color === "Utility") return false;
    const isComplete = player.properties[color].length >= SET_SIZES[color];
    return isComplete && !player.buildings[color].house;
  });

  if (!validColors.length) {
    logAction("No valid sets for House.");
    state.discard.push(card);
    render();
    return;
  }

  modalTitle.textContent = "Place House";
  modalBody.innerHTML = "";
  const actions = document.createElement("div");
  actions.className = "card-list";
  validColors.forEach((color) => {
    const btn = document.createElement("button");
    btn.textContent = color;
    btn.addEventListener("click", () => {
      player.buildings[color].house = true;
      state.discard.push(card);
      logAction(`${player.name} placed a House on ${color}.`);
      closeModal();
      render();
    });
    actions.appendChild(btn);
  });
  modalBody.appendChild(actions);
  openModal();
}

function placeHotel(card) {
  const player = currentPlayer();
  const validColors = COLORS.filter((color) => {
    if (color === "Railroad" || color === "Utility") return false;
    const isComplete = player.properties[color].length >= SET_SIZES[color];
    return isComplete && player.buildings[color].house && !player.buildings[color].hotel;
  });

  if (!validColors.length) {
    logAction("No valid sets for Hotel.");
    state.discard.push(card);
    render();
    return;
  }

  modalTitle.textContent = "Place Hotel";
  modalBody.innerHTML = "";
  const actions = document.createElement("div");
  actions.className = "card-list";
  validColors.forEach((color) => {
    const btn = document.createElement("button");
    btn.textContent = color;
    btn.addEventListener("click", () => {
      player.buildings[color].hotel = true;
      state.discard.push(card);
      logAction(`${player.name} placed a Hotel on ${color}.`);
      closeModal();
      render();
    });
    actions.appendChild(btn);
  });
  modalBody.appendChild(actions);
  openModal();
}

function doubleTheRent(card) {
  const player = currentPlayer();
  const rentCards = player.hand.filter((c) => c.type === "rent");
  if (!rentCards.length) {
    logAction("No rent card to double.");
    state.discard.push(card);
    render();
    return;
  }

  modalTitle.textContent = "Double The Rent";
  modalBody.innerHTML = "";
  const info = document.createElement("p");
  info.textContent = "Choose a rent card to play with Double The Rent.";
  modalBody.appendChild(info);

  const actions = document.createElement("div");
  actions.className = "card-list";
  rentCards.forEach((rentCard) => {
    const btn = document.createElement("button");
    btn.textContent = rentCard.name;
    btn.addEventListener("click", () => {
      removeCard(player.hand, rentCard.id);
      state.discard.push(rentCard);
      state.discard.push(card);
      closeModal();
      playRent(rentCard, 2);
    });
    actions.appendChild(btn);
  });
  modalBody.appendChild(actions);
  openModal();
}

function playRent(card, multiplier) {
  const player = currentPlayer();
  const colors = card.colors || [];

  modalTitle.textContent = "Collect Rent";
  modalBody.innerHTML = "";
  const info = document.createElement("p");
  info.textContent = "Choose a color set to charge rent.";
  modalBody.appendChild(info);

  const actions = document.createElement("div");
  actions.className = "card-list";
  colors.forEach((color) => {
    const rent = computeRent(player, color, multiplier);
    const btn = document.createElement("button");
    btn.textContent = `${color} ($${rent}M)`;
    btn.addEventListener("click", () => {
      closeModal();
      chooseTargetPlayer("Charge rent to", (targetIndex) => {
        offerJustSayNo(targetIndex, card, () => {
          collectPayment(targetIndex, state.currentPlayerIndex, rent, `Rent (${color})`, () => {
            logAction(`${player.name} charged $${rent}M rent to ${state.players[targetIndex].name}.`);
            render();
          });
        }, () => render());
      });
    });
    actions.appendChild(btn);
  });
  modalBody.appendChild(actions);
  openModal();
}

function computeRent(player, color, multiplier) {
  const count = player.properties[color].length;
  if (count === 0) return 0;
  const rentTable = RENT_TABLE[color] || [];
  const base = rentTable[Math.min(count, rentTable.length) - 1] || 0;
  const buildings = player.buildings[color];
  const bonus = (buildings.house ? 3 : 0) + (buildings.hotel ? 4 : 0);
  return (base + bonus) * multiplier;
}

function hasStealableProperty(player) {
  return COLORS.some((color) => {
    const isComplete = player.properties[color].length >= SET_SIZES[color];
    if (isComplete) return false;
    return player.properties[color].length > 0;
  });
}

function choosePropertyFromPlayer(playerIndex, allowComplete, onSelect) {
  const player = state.players[playerIndex];
  modalTitle.textContent = `Select property from ${player.name}`;
  modalBody.innerHTML = "";
  const list = document.createElement("div");
  list.className = "card-list";

  COLORS.forEach((color) => {
    const isComplete = player.properties[color].length >= SET_SIZES[color];
    if (!allowComplete && isComplete) return;
    player.properties[color].forEach((card) => {
      const btn = document.createElement("button");
      btn.textContent = cardLabel(card);
      btn.addEventListener("click", () => {
        closeModal();
        onSelect(color, card);
      });
      list.appendChild(btn);
    });
  });

  if (!list.children.length) {
    const msg = document.createElement("div");
    msg.textContent = "No valid properties.";
    modalBody.appendChild(msg);
  } else {
    modalBody.appendChild(list);
  }
  openModal();
}

function chooseCompleteSet(playerIndex, onSelect) {
  const player = state.players[playerIndex];
  modalTitle.textContent = `Select a complete set from ${player.name}`;
  modalBody.innerHTML = "";
  const actions = document.createElement("div");
  actions.className = "card-list";

  completeSets(player).forEach((color) => {
    const btn = document.createElement("button");
    btn.textContent = color;
    btn.addEventListener("click", () => {
      closeModal();
      onSelect(color);
    });
    actions.appendChild(btn);
  });

  if (!actions.children.length) {
    const msg = document.createElement("div");
    msg.textContent = "No complete sets.";
    modalBody.appendChild(msg);
  } else {
    modalBody.appendChild(actions);
  }
  openModal();
}

function completeSets(player) {
  return COLORS.filter((color) => player.properties[color].length >= SET_SIZES[color]);
}

function transferProperty(fromIndex, toIndex, color, card) {
  const fromPlayer = state.players[fromIndex];
  const toPlayer = state.players[toIndex];
  removeCard(fromPlayer.properties[color], card.id);
  toPlayer.properties[card.assignedColor || color].push(card);
}

function stealSet(fromIndex, toIndex, color) {
  const fromPlayer = state.players[fromIndex];
  const toPlayer = state.players[toIndex];
  const cards = fromPlayer.properties[color].splice(0);
  cards.forEach((card) => {
    toPlayer.properties[color].push(card);
  });
  toPlayer.buildings[color].house = fromPlayer.buildings[color].house;
  toPlayer.buildings[color].hotel = fromPlayer.buildings[color].hotel;
  fromPlayer.buildings[color].house = false;
  fromPlayer.buildings[color].hotel = false;
}

function moveWild(card, fromColor) {
  const player = currentPlayer();
  modalTitle.textContent = `Move ${card.name}`;
  modalBody.innerHTML = "";
  const actions = document.createElement("div");
  actions.className = "card-list";

  const options = card.colors.filter((color) => color !== fromColor);
  options.forEach((color) => {
    const btn = document.createElement("button");
    btn.textContent = color;
    btn.addEventListener("click", () => {
      removeCard(player.properties[fromColor], card.id);
      const moved = { ...card, assignedColor: color };
      player.properties[color].push(moved);
      logAction(`${player.name} moved ${card.name} to ${color}.`);
      closeModal();
      render();
    });
    actions.appendChild(btn);
  });

  if (!actions.children.length) {
    const msg = document.createElement("div");
    msg.textContent = "No alternate colors.";
    modalBody.appendChild(msg);
  } else {
    modalBody.appendChild(actions);
  }
  openModal();
}

function enforceHandLimit(onDone) {
  const player = currentPlayer();
  if (player.hand.length <= 7) {
    onDone();
    return;
  }

  modalTitle.textContent = `Discard to 7 (${player.hand.length}/7)`;
  modalBody.innerHTML = "";
  const info = document.createElement("p");
  info.textContent = "Select cards to discard until you have 7.";
  modalBody.appendChild(info);

  const list = document.createElement("div");
  list.className = "card-list";
  player.hand.forEach((card) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `card ${cardClass(card)}`;
    btn.textContent = cardLabel(card);
    btn.addEventListener("click", () => {
      removeCard(player.hand, card.id);
      state.discard.push(card);
      logAction(`${player.name} discarded ${card.name} (hand limit).`);
      if (player.hand.length <= 7) {
        closeModal();
        onDone();
        render();
      } else {
        enforceHandLimit(onDone);
      }
    });
    list.appendChild(btn);
  });
  modalBody.appendChild(list);
  openModal();
}

playerCountSelect.addEventListener("change", initPlayerInputs);
startGameBtn.addEventListener("click", startGame);
modalCancel.addEventListener("click", closeModal);

peekDeckBtn.addEventListener("click", () => {
  if (!state) return;
  const top = state.deck.slice(-5).reverse();
  deckPeek.innerHTML = top.length
    ? top.map((card) => `<div>${card.name}</div>`).join("")
    : "Empty";
});

drawBtn.addEventListener("click", () => {
  if (!state) return;
  if (state.hasDrawn) {
    logAction("Already drew this turn.");
    render();
    return;
  }
  drawCards(2);
  state.hasDrawn = true;
  logAction(`${currentPlayer().name} drew 2 cards.`);
  render();
});

endTurnBtn.addEventListener("click", () => {
  if (!state) return;
  if (!state.hasDrawn) {
    logAction("Draw before ending turn.");
    render();
    return;
  }

  const advanceTurn = () => {
    state.currentPlayerIndex =
      (state.currentPlayerIndex + 1) % state.players.length;
    state.actionsRemaining = 3;
    state.hasDrawn = false;
    deckPeek.innerHTML = "";
    logAction(`Turn passed to ${currentPlayer().name}.`);
    render();
  };

  enforceHandLimit(advanceTurn);
});

initPlayerInputs();
