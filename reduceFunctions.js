//Example reduce functions;

  function reducePeriodAdd(i, d) {
    if (d.Year === 2020) {
      ++i.current;
    } else {
      ++i.prerevious;
    }
    return i;
  }
  function reducePeriodRemove(i, d) {
    if (d.Year === 2020) {
      --i.current;
    } else {
      --i.previous;
    }
    return i;
  }

  function reducePeriodInitial(i, d) {
    return {
      current: 0,
      previous: 0,
    };
  }