module.exports = (endpoint) => {
  const match = endpoint.match(/{([a-z,_]{0,})\w}+/);
  if (match) {
    const [firstMatch] = match;
    const formattedendpoint = endpoint.replace(
      firstMatch,
      `:${firstMatch.substr(1, firstMatch.length - 2)}`
    );
    return formattedendpoint;
  } else {
    return endpoint;
  }
};
