const trimWhiteSpace = (data) => Object.keys(data).reduce((accumulator, currentValue) => {
  accumulator[currentValue] = (typeof (data[currentValue]) === 'string') ? data[currentValue].trim() : data[currentValue];
  return accumulator;
}, {});

const sanitize = (input) => (input ? trimWhiteSpace(input) : input);

module.exports = {
  sanitize,
};
