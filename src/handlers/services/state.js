let state = { botOn: false };

function getBotState() {
  return state.botOn;
}

function setBotState(value) {
  state.botOn = value;
}

module.exports = { getBotState, setBotState };
