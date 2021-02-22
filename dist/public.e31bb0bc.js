// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
function print_filter(filter) {
  var f = eval(filter);

  if (typeof f.length != "undefined") {} else {}

  if (typeof f.top != "undefined") {
    f = f.top(Infinity);
  } else {}

  if (typeof f.dimension != "undefined") {
    f = f.dimension(function (d) {
      return "";
    }).top(Infinity);
  } else {}

  console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}

function remove_empty_bins(source_group) {
  return {
    all: function all() {
      return source_group.all().filter(function (d) {
        return d.value != 0;
      });
    }
  };
}

var colors = ["#AB4642", "#DC9656", "#F7CA88", "#A1B56C", "#86C1B9", "#4D6C77", "#BA8BAF", "#A16945"];
var dayFormat = d3.timeFormat("%b %d");
var numFormatLg = d3.format("~s");
var numFormat = d3.format(",");
var monthName = d3.timeFormat("%B");
var monthFormat = d3.timeFormat("%m");
var percentFormat = d3.format(".0%");
var dollarFormat = d3.format("$,.2f");
var dollarRoundFormat = d3.format("$,.3s");

function remove_empty_bins(source_group) {
  return {
    all: function all() {
      return source_group.all().filter(function (d) {
        return d.value != 0;
      });
    }
  };
}

function getUniqueYears(value, index, self) {
  return self.indexOf(value) === index;
}

window.loadData = function (json) {
  var data = JSON.parse(json);

  var updateObjects = function updateObjects(d, i) {
    d.Date = new Date(d.fieldData.Date);
    d.Year = d.Date.getFullYear();
    d.All = "Sales";
  }; //Update each array element with a year property


  data.forEach(updateObjects);
  var years = data.map(function (d) {
    return d.Year;
  }).filter(getUniqueYears).sort();
  var lengthYears = years.length;
  console.log(lengthYears); //Set the data into crossfilter

  var facts = crossfilter(data); //Set a variable with the field name.

  var companiesKey = "Companies::Name";
  var regionKey = "Companies::Region";
  var productKey = "Products::Name";
  var salesKey = "SalesAmt"; //Companies Count Bar Chart
  //sales over time

  window.salesOverTime = dc.lineChart("#salesOverTime");
  var salesDim = facts.dimension(function (d) {
    return d.Date;
  });
  var salesGroup = salesDim.group().reduceSum(function (d) {
    return d.fieldData[salesKey];
  });
  var minDate = salesDim.bottom(1)[0].Date;
  var maxDate = salesDim.top(1)[0].Date;
  salesOverTime.group(remove_empty_bins(salesGroup)).dimension(salesDim).colors(colors[6]).height(200).x(d3.scaleTime().domain([minDate, maxDate])).brushOn(false).renderLabel(false).title(function (d) {
    return dayFormat(d.key) + " " + dollarFormat(d.value);
  }).elasticX(true).elasticY(true).xUnits(d3.timeDays); //create the bar chart

  window.companiesBarChart = dc.barChart("#companiesBarChart"); //create the dimension. Return which data key you want to display on x-axis

  var companiesDim = facts.dimension(function (d) {
    return d.fieldData[companiesKey];
  }); //group the companies. By default, we're just doing a count here.

  var companiesGroup = companiesDim.group(); //set bar chart options

  companiesBarChart.group(remove_empty_bins(companiesGroup)).dimension(companiesDim).renderLabel(true).clipPadding(12).height(200).x(d3.scaleBand()).xUnits(dc.units.ordinal).colorAccessor(function (d, i) {
    return i;
  }).outerPadding(150).xAxisLabel("", 100).elasticX(true).elasticY(true).ordinalColors(colors);
  window.countByRegion = dc.pieChart("#countByRegion");
  var countByRegionDim = facts.dimension(function (d) {
    return d.fieldData[regionKey];
  });
  var countByRegionGr = countByRegionDim.group();
  countByRegion.group(remove_empty_bins(countByRegionGr)).dimension(countByRegionDim).height(300).cap(3).ordinalColors(colors).title(function (d) {
    return d.key + " " + numFormatLg(d.value);
  }).on("pretransition", function (chart) {
    chart.selectAll("text.pie-slice").text(function (d) {
      var a = d.data.key;
      var v = d.data.value;
      return d.data.key + " " + percentFormat(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI)));
    });
  });
  window.sumByRegion = dc.pieChart("#sumByRegion");
  var sumByRegionDim = facts.dimension(function (d) {
    return d.fieldData[regionKey];
  });
  var sumByRegionGr = remove_empty_bins(countByRegionDim.group().reduceSum(function (d) {
    return d.fieldData[salesKey];
  }));
  sumByRegion.group(sumByRegionGr).dimension(countByRegionDim).height(300).ordinalColors(colors).title(function (d) {
    return d.key + " " + d.value;
  }).on("pretransition", function (chart) {
    chart.selectAll("text.pie-slice").text(function (d) {
      var a = d.data.key;
      var v = d.data.value;
      return d.data.key + " " + percentFormat(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI)));
    });
  });
  window.productSales = dc.rowChart("#productSales");
  var productSalesDim = facts.dimension(function (d) {
    return d.fieldData[productKey];
  });
  var productSalesGr = remove_empty_bins(productSalesDim.group().reduceSum(function (d) {
    return d.fieldData[salesKey];
  }));
  var productSalesColor = d3.scaleLinear().domain([0, 10, 30, 100, productSalesGr]).range(colors);
  productSales.group(productSalesGr).width(500).height(400).gap(1).fixedBarHeight(15).dimension(productSalesDim).colors(productSalesColor).colorAccessor(function (d, i) {
    return i;
  });

  function sel_stack(i) {
    console.log(i);
    return function (d) {
      console.log(d);
      return d.value[i];
    };
  }

  console.log(years[0]);
  window.salesByYear = dc.barChart("#salesByYear");
  var salesByYearDim = facts.dimension(function (d) {
    return d.All;
  });
  var salesByYearGr = salesByYearDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
  print_filter(salesByYearGr);
  salesByYear.dimension(salesByYearDim).group(salesByYearGr, years[0].toString(), sel_stack("2016")).renderLabel(false).height(200).ordinalColors(colors).x(d3.scaleBand()).xUnits(dc.units.ordinal).title(function (d) {
    return d.key + " " + this.layer + " " + dollarFormat(d.value[this.layer]);
  }).elasticX(true).elasticY(true);

  for (var i = 1; i < lengthYears; ++i) {
    salesByYear.stack(salesByYearGr, "" + years[i], sel_stack(years[i]));
  } // .ordinalColors(colors);


  dc.renderAll();
};

function reduceAdd(i, d) {
  var y = d.Year.toString();
  i[y] = i[y] + d.fieldData.SalesAmt || d.fieldData.SalesAmt;
  return i;
}

function reduceRemove(i, d) {
  var y = d.Year;
  var y = d.Year.toString();
  i[y] = i[y] - d.fieldData.SalesAmt || 0;
  return i;
}

function reduceInitial(i, d) {
  return {};
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50482" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/public.e31bb0bc.js.map