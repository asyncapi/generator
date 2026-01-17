module.exports = {
  escapeType: function(type) {
    return type ? type.replace(/\|/g, '&#124;') : type;
  }
};
