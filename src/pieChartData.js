// PieChartDataItem Class Definition
function PieChartDataItem(options) {
  options = options || {};

  this._type = options.type;
  this._name = options.name;
  this._value = 0;
  this._size = 0;
}

PieChartDataItem.prototype.name = function() {
  return this._name;
};
PieChartDataItem.prototype.size = function() {
  return this._size;
};

PieChartDataItem.prototype.isZero = function() {
  return this._value === 0;
};

PieChartDataItem.prototype.bump = function(data) {
  this._value += 1;
  this._size += data.size;
};

PieChartDataItem.prototype.toJSON = function(type) {
  return {
    name: this._name,
    y: type === 'size' ? ((this._size / 1024) | 0) : this._value
  };
};

// PieChartData Class Definitio
function PieChartData() {
  this._index = {};
  this._series = [];
}

PieChartData.prototype.addSeries = function(options) {
  options = options || {};
  var isDefault = Boolean(options.default);

  // Cannot add default
  if (isDefault && this._index['default']) {
    return;
  }

  options.type = isDefault ? ['default'] : options.type;

  if (!Array.isArray(options.type)) {
    return;
  }

  var it = new PieChartDataItem(options);
  var idx = this._series.length;
  this._series[idx] = it;
  for (var i = 0, l = options.type.length; i < l; i++) {
    this._index[options.type[i]] = idx;
  }
}


PieChartData.prototype.bump = function(file) {
  var idx = this._index[file.ext];
  var s = this._series[idx];

  // Try to find default series
  if (!s) {
    s = this._series['default'];
  }

  // skip
  if (!s) {
    return;
  }

  s.bump(file);
};

PieChartData.prototype.toJSON = function(type) {
  var results = [];
  var l = this._series.length;
  for (var i = 0; i < l; i++) {
    if (this._series[i].isZero()) {
      continue;
    }
    results.push(this._series[i].toJSON(type));
  }
  return results;
};

function CreateLangStatChart(files) {
  var chart = new PieChartData();

  // Javascript
  chart.addSeries({
    type: ['.js'],
    name: 'Javascript'
  });
  // TypeScript
  chart.addSeries({
    type: ['.ts'],
    name: 'TypeScript'
  });
  // CoffeeScript
  chart.addSeries({
    type: ['.coffee'],
    name: 'CoffeeScript'
  });
  // C++
  chart.addSeries({
    type: ['.cpp'],
    name: 'C++'
  });
  // Ruby
  chart.addSeries({
    type: ['.rb'],
    name: 'Ruby'
  });
  // Python
  chart.addSeries({
    type: ['.py'],
    name: 'Python'
  });
  // C#
  chart.addSeries({
    type: ['.cs'],
    name: 'C#'
  });
  // HTML
  chart.addSeries({
    type: ['.html', '.htm'],
    name: 'HTML'
  });
  // CSS
  chart.addSeries({
    type: ['.css'],
    name: 'CSS'
  });
  // Stylus
  chart.addSeries({
    type: ['.styl'],
    name: 'Stylus'
  });
  // SASS
  chart.addSeries({
    type: ['.scss'],
    name: 'SASS'
  });
  // LESS
  chart.addSeries({
    type: '.less',
    name: 'LESS'
  });
  // JPEG
  chart.addSeries({
    type: ['.jpg', '.jpeg'],
    name: 'JPEG'
  });
  // PNG
  chart.addSeries({
    type: ['.png'],
    name: 'PNG'
  });
  // GIF
  chart.addSeries({
    type: ['.gif'],
    name: 'GIF'
  });
  // SVG
  chart.addSeries({
    type: ['.svg'],
    name: 'SVG'
  });
  // Webp
  chart.addSeries({
    type: ['.webp'],
    name: 'Webp'
  });
  // Other
  chart.addSeries({
    default: true,
    name: 'Others'
  });

  var l = files.length;
  for (var i = 0; i < l; i++) {
    chart.bump(files[i]);
  }

  return chart;
}

module.exports.PieChartData = PieChartData;
module.exports.CreateLangStatChart = CreateLangStatChart;
