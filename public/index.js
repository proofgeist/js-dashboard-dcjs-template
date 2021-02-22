function print_filter(filter) {
  var f = eval(filter);
  if (typeof f.length != "undefined") {
  } else {
  }
  if (typeof f.top != "undefined") {
    f = f.top(Infinity);
  } else {
  }
  if (typeof f.dimension != "undefined") {
    f = f
      .dimension(function (d) {
        return "";
      })
      .top(Infinity);
  } else {
  }
  console.log(
    filter +
      "(" +
      f.length +
      ") = " +
      JSON.stringify(f)
        .replace("[", "[\n\t")
        .replace(/}\,/g, "},\n\t")
        .replace("]", "\n]")
  );
}

function remove_empty_bins(source_group) {
  return {
    all: function () {
      return source_group.all().filter(function (d) {
        return d.value != 0;
      });
    },
  };
}
var colors = [
  "#AB4642",
  "#DC9656",
  "#F7CA88",
  "#A1B56C",
  "#86C1B9",
  "#4D6C77",
  "#BA8BAF",
  "#A16945",
];
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
    all: function () {
      return source_group.all().filter(function (d) {
        return d.value != 0;
      });
    },
  };
}
function getUniqueYears(value, index, self) {
  return self.indexOf(value) === index;
}
window.loadData = function (json) {
  var data = JSON.parse(json);
  var updateObjects = function (d, i) {
    d.Date = new Date(d.fieldData.Date);
    d.Year = d.Date.getFullYear();
    d.All = "Sales";
  };
  //Update each array element with a year property
  data.forEach(updateObjects);
  var years = data
    .map(function (d) {
      return d.Year;
    })
    .filter(getUniqueYears)
    .sort();
  var lengthYears = years.length;
  console.log(lengthYears);
  //Set the data into crossfilter
  var facts = crossfilter(data);

  //Set a variable with the field name.
  var companiesKey = "Companies::Name";
  var regionKey = "Companies::Region";
  var productKey = "Products::Name";
  var salesKey = "SalesAmt";
  //Companies Count Bar Chart

  //sales over time

  window.salesOverTime = dc.lineChart("#salesOverTime");

  var salesDim = facts.dimension(function (d) {
    return d.Date;
  });
  var salesGroup = salesDim.group().reduceSum((d) => d.fieldData[salesKey]);
  var minDate = salesDim.bottom(1)[0].Date;
  var maxDate = salesDim.top(1)[0].Date;
  salesOverTime
    .group(remove_empty_bins(salesGroup))
    .dimension(salesDim)
    .colors(colors[6])
    .height(200)
    .x(d3.scaleTime().domain([minDate, maxDate]))

    .brushOn(false)
    .renderLabel(false)
    .title(function (d) {
      return dayFormat(d.key) + " " + dollarFormat(d.value);
    })
    .elasticX(true)
    .elasticY(true)
    .xUnits(d3.timeDays);
  //create the bar chart
  window.companiesBarChart = dc.barChart("#companiesBarChart");

  //create the dimension. Return which data key you want to display on x-axis
  var companiesDim = facts.dimension(function (d) {
    return d.fieldData[companiesKey];
  });
  //group the companies. By default, we're just doing a count here.
  var companiesGroup = companiesDim.group();

  //set bar chart options
  companiesBarChart
    .group(remove_empty_bins(companiesGroup))
    .dimension(companiesDim)
    .renderLabel(true)
    .clipPadding(12)
    .height(200)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .colorAccessor(function (d, i) {
      return i;
    })
    .outerPadding(150)
    .xAxisLabel("", 100)
    .elasticX(true)
    .elasticY(true)
    .ordinalColors(colors);

  window.countByRegion = dc.pieChart("#countByRegion");

  var countByRegionDim = facts.dimension(function (d) {
    return d.fieldData[regionKey];
  });
  var countByRegionGr = countByRegionDim.group();

  countByRegion
    .group(remove_empty_bins(countByRegionGr))
    .dimension(countByRegionDim)
    .height(300)
    .cap(3)
    .ordinalColors(colors)
    .title(function (d) {
      return d.key + " " + numFormatLg(d.value);
    })
    .on("pretransition", function (chart) {
      chart.selectAll("text.pie-slice").text(function (d) {
        var a = d.data.key;
        var v = d.data.value;
        return (
          d.data.key +
          " " +
          percentFormat(
            dc.utils.printSingleValue(
              (d.endAngle - d.startAngle) / (2 * Math.PI)
            )
          )
        );
      });
    });

  window.sumByRegion = dc.pieChart("#sumByRegion");

  var sumByRegionDim = facts.dimension(function (d) {
    return d.fieldData[regionKey];
  });
  var sumByRegionGr = remove_empty_bins(
    countByRegionDim.group().reduceSum(function (d) {
      return d.fieldData[salesKey];
    })
  );

  sumByRegion
    .group(sumByRegionGr)
    .dimension(countByRegionDim)
    .height(300)
    .ordinalColors(colors)

    .title(function (d) {
      return d.key + " " + d.value;
    })
    .on("pretransition", function (chart) {
      chart.selectAll("text.pie-slice").text(function (d) {
        var a = d.data.key;
        var v = d.data.value;
        return (
          d.data.key +
          " " +
          percentFormat(
            dc.utils.printSingleValue(
              (d.endAngle - d.startAngle) / (2 * Math.PI)
            )
          )
        );
      });
    });

  window.productSales = dc.rowChart("#productSales");
  var productSalesDim = facts.dimension((d) => d.fieldData[productKey]);
  var productSalesGr = remove_empty_bins(
    productSalesDim.group().reduceSum((d) => d.fieldData[salesKey])
  );

  var productSalesColor = d3
    .scaleLinear()
    .domain([0, 10, 30, 100, productSalesGr])
    .range(colors);
  productSales
    .group(productSalesGr)
    .width(500)
    .height(400)
    .gap(1)
    .fixedBarHeight(15)
    .dimension(productSalesDim)
    .colors(productSalesColor)
    .colorAccessor(function (d, i) {
      return i;
    });

  function sel_stack(i) {
    console.log(i);
    return (d) => {
      console.log(d);
      return d.value[i];
    };
  }
  console.log(years[0]);
  window.salesByYear = dc.barChart("#salesByYear");
  var salesByYearDim = facts.dimension((d) => d.All);
  var salesByYearGr = salesByYearDim
    .group()
    .reduce(reduceAdd, reduceRemove, reduceInitial);
  print_filter(salesByYearGr);
  salesByYear
    .dimension(salesByYearDim)
    .group(salesByYearGr, years[0].toString(), sel_stack("2016"))
    .renderLabel(false)
    .height(200)
    .ordinalColors(colors)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .title(function (d) {
      return d.key + " " + this.layer + " " + dollarFormat(d.value[this.layer]);
    })
    .elasticX(true)
    .elasticY(true);

  for (var i = 1; i < lengthYears; ++i) {
    salesByYear.stack(salesByYearGr, "" + years[i], sel_stack(years[i]));
  }
  // .ordinalColors(colors);
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
