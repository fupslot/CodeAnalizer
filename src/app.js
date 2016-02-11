const electron = require('electron');
const remote = electron.remote;
const dialog = remote.dialog;
const Highcharts = require('highcharts');
const lodash = require('lodash');
const walking = require('./src/walking');
const PieChartData = require('./src/pieChartData');

var openFolder = document.getElementById('open-folder');
var chartContainer = document.getElementById('chart-container');
var indicator = document.getElementById('indicator');
var title = document.getElementById('title');
var subtitle = document.getElementById('subtitle');

var filderName = function(path) {
  var start = path.lastIndexOf('/');
  return path.substr(start + 1, path.length);
}

var onOpenFolder = function() {
  dialog.showOpenDialog({properties: ['openDirectory']}, onOpenDirectory);
};

var onOpenDirectory = function(folders) {
  var folder = folders[0];

  if (!folder) {
    return;
  }

  // Folder Name
  title.innerText = 'Project: ' + filderName(folder);
  // Folder Path
  subtitle.innerText = 'Path: ' + folder;

  indicator.innerText = 'Analysing...';
  walking(folder, onFolderScanDone);
};

var onFolderScanDone = function(err, files) {
  var langStatData;

  if (err) {
    indicator.innerText = 'Oops! Something went wrong!';
    return;
  }

  langStatData = PieChartData.CreateLangStatChart(files);

  // Language Statistic
  showLangStatChart(
    document.getElementById('lang-stat'),
    langStatData.toJSON()
  );

  showLangSizeStatChart(
    document.getElementById('file-stat'),
    langStatData.toJSON('size')
  );

  indicator.innerText = '';
};

function showLangStatChart(element, data) {
  Highcharts.chart(element, {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Technology Used'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: false
              },
              showInLegend: true
          }
      },
      series: [{
          name: 'Technology',
          colorByPoint: true,
          data: data
      }]
  });
}

function showLangSizeStatChart(element, data) {
  Highcharts.chart(element, {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Codebase Size'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Total files size (KB)'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}KB</b> of total<br/>'
        },

        series: [{
            name: 'Technology',
            colorByPoint: true,
            data: data
        }],
    });
}

openFolder.addEventListener('click', onOpenFolder);
