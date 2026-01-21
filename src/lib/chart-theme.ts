/**
 * SB Index Brand Chart Theme for Highcharts
 * Typography: Forma DJR Display (headers), Inter (body), Lora (accents)
 * Colors: Brand palette with HSL values for theming
 */

// Brand Color Palette
export const BRAND_COLORS = {
  // Primary Colors
  primaryGreen: '#34502b',      // Main brand, CTAs, headings
  lightGreen: '#b7c895',        // Accents, highlights
  mediumGreen: '#7c9457',       // Secondary elements
  darkGreen: '#1b864a',         // Emphasis
  
  // Neutral Colors
  charcoal: '#1d1d1b',          // Dark text
  
  // Accent Colors
  beigeGold: '#f0d2b0',         // Warm accents
  blueOcean: '#6ec0dc',         // Charts, variety
  darkTeal: '#09657b',          // Charts, links
  orangeTerra: '#dd8c57',       // Warnings, accents
  brown: '#945438',             // Earth tones
  
  // System Colors
  white: '#ffffff',
  lightGray: '#f5f5f5',
  mediumGray: '#e0e0e0',
  darkGray: '#666666',
} as const;

// Chart Color Sequences for different chart types
export const CHART_COLOR_SEQUENCES = {
  // Primary sequence for most charts
  primary: [
    BRAND_COLORS.primaryGreen,
    BRAND_COLORS.blueOcean,
    BRAND_COLORS.orangeTerra,
    BRAND_COLORS.mediumGreen,
    BRAND_COLORS.darkTeal,
    BRAND_COLORS.beigeGold,
    BRAND_COLORS.brown,
    BRAND_COLORS.lightGreen,
    BRAND_COLORS.darkGreen,
  ],
  
  // Sequential (for gradients/heatmaps)
  sequential: [
    '#e8f5e9',
    '#c8e6c9',
    '#a5d6a7',
    '#81c784',
    '#66bb6a',
    '#4caf50',
    '#43a047',
    '#388e3c',
    '#2e7d32',
    '#1b5e20',
  ],
  
  // Diverging (for comparison)
  diverging: [
    BRAND_COLORS.orangeTerra,
    '#f4a574',
    '#fdd9bd',
    '#f5f5f5',
    '#b7d1a0',
    '#7c9457',
    BRAND_COLORS.primaryGreen,
  ],
  
  // Categorical (max contrast)
  categorical: [
    BRAND_COLORS.primaryGreen,
    BRAND_COLORS.blueOcean,
    BRAND_COLORS.orangeTerra,
    BRAND_COLORS.darkTeal,
    BRAND_COLORS.brown,
    BRAND_COLORS.mediumGreen,
    BRAND_COLORS.beigeGold,
    BRAND_COLORS.darkGreen,
  ],
} as const;

// Highcharts Theme Configuration
export const highchartsTheme: Highcharts.Options = {
  colors: [...CHART_COLOR_SEQUENCES.primary] as string[],
  
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    height: 400,
    spacing: [20, 20, 20, 20],
    borderRadius: 12,
  },
  
  title: {
    style: {
      color: BRAND_COLORS.charcoal,
      fontFamily: '"Forma DJR Display", Inter, system-ui, sans-serif',
      fontSize: '18px',
      fontWeight: '600',
    },
    align: 'left',
  },
  
  subtitle: {
    style: {
      color: BRAND_COLORS.darkGray,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '13px',
      fontWeight: '400',
    },
    align: 'left',
  },
  
  xAxis: {
    gridLineColor: BRAND_COLORS.mediumGray,
    lineColor: BRAND_COLORS.primaryGreen,
    tickColor: BRAND_COLORS.primaryGreen,
    labels: {
      style: {
        color: BRAND_COLORS.darkGray,
        fontSize: '11px',
      },
    },
    title: {
      style: {
        color: BRAND_COLORS.charcoal,
        fontSize: '12px',
        fontWeight: '500',
      },
    },
  },
  
  yAxis: {
    gridLineColor: BRAND_COLORS.mediumGray,
    lineColor: BRAND_COLORS.primaryGreen,
    labels: {
      style: {
        color: BRAND_COLORS.darkGray,
        fontSize: '11px',
      },
    },
    title: {
      style: {
        color: BRAND_COLORS.charcoal,
        fontSize: '12px',
        fontWeight: '500',
      },
    },
  },
  
  legend: {
    backgroundColor: 'transparent',
    borderColor: BRAND_COLORS.mediumGray,
    borderRadius: 8,
    itemStyle: {
      color: BRAND_COLORS.charcoal,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '12px',
      fontWeight: '400',
    },
    itemHoverStyle: {
      color: BRAND_COLORS.primaryGreen,
    },
    itemHiddenStyle: {
      color: BRAND_COLORS.mediumGray,
    },
  },
  
  tooltip: {
    backgroundColor: BRAND_COLORS.white,
    borderColor: BRAND_COLORS.mediumGray,
    borderRadius: 8,
    shadow: {
      color: 'rgba(0,0,0,0.1)',
      offsetX: 0,
      offsetY: 4,
      opacity: 0.2,
      width: 8,
    },
    style: {
      color: BRAND_COLORS.charcoal,
      fontSize: '12px',
    },
    headerFormat: '<span style="font-size: 11px; font-weight: 600; color: ' + BRAND_COLORS.primaryGreen + '">{point.key}</span><br/>',
  },
  
  plotOptions: {
    series: {
      animation: {
        duration: 500,
      },
    },
    bar: {
      borderRadius: 4 as any,
    },
    column: {
      borderRadius: 4 as any,
    },
    pie: {
      borderRadius: 4 as any,
      borderWidth: 2,
      borderColor: BRAND_COLORS.white as any,
    },
    line: {
      marker: {
        radius: 4,
        symbol: 'circle',
      },
    },
    area: {
      fillOpacity: 0.3,
      marker: {
        radius: 3,
      },
    },
    scatter: {
      marker: {
        radius: 6,
        symbol: 'circle',
      },
    },
  },
  
  credits: {
    enabled: false,
  },
  
  exporting: {
    enabled: true,
    buttons: {
      contextButton: {
        symbolStroke: BRAND_COLORS.primaryGreen,
        theme: {
          fill: 'transparent',
          stroke: BRAND_COLORS.mediumGray,
        },
      },
    },
  },
  
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500,
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
        },
      },
    }],
  },
};

// Dark mode theme overrides
export const highchartsDarkTheme: Partial<Highcharts.Options> = {
  chart: {
    backgroundColor: 'transparent',
  },
  title: {
    style: {
      color: '#f5f5f5',
    },
  },
  subtitle: {
    style: {
      color: '#a0a0a0',
    },
  },
  xAxis: {
    gridLineColor: '#333333',
    lineColor: BRAND_COLORS.lightGreen,
    tickColor: BRAND_COLORS.lightGreen,
    labels: {
      style: {
        color: '#a0a0a0',
      },
    },
    title: {
      style: {
        color: '#f5f5f5',
      },
    },
  },
  yAxis: {
    gridLineColor: '#333333',
    lineColor: BRAND_COLORS.lightGreen,
    labels: {
      style: {
        color: '#a0a0a0',
      },
    },
    title: {
      style: {
        color: '#f5f5f5',
      },
    },
  },
  legend: {
    itemStyle: {
      color: '#f5f5f5',
    },
    itemHoverStyle: {
      color: BRAND_COLORS.lightGreen,
    },
  },
  tooltip: {
    backgroundColor: '#1d1d1b',
    borderColor: '#333333',
    style: {
      color: '#f5f5f5',
    },
  },
};

// Chart type configurations
export const CHART_TYPE_DEFAULTS: Record<string, Partial<Highcharts.Options>> = {
  line: {
    chart: { type: 'line' },
    plotOptions: {
      line: {
        marker: { enabled: true, radius: 4 },
        lineWidth: 2,
      },
    },
  },
  bar: {
    chart: { type: 'bar' },
    plotOptions: {
      bar: { dataLabels: { enabled: false } },
    },
  },
  column: {
    chart: { type: 'column' },
    plotOptions: {
      column: { dataLabels: { enabled: false } },
    },
  },
  pie: {
    chart: { type: 'pie' },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
        },
        showInLegend: true,
      },
    },
  },
  donut: {
    chart: { type: 'pie' },
    plotOptions: {
      pie: {
        innerSize: '60%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: { enabled: true },
        showInLegend: true,
      },
    },
  },
  area: {
    chart: { type: 'area' },
    plotOptions: {
      area: {
        fillOpacity: 0.3,
        marker: { enabled: false },
      },
    },
  },
  scatter: {
    chart: { type: 'scatter' },
    plotOptions: {
      scatter: {
        marker: { radius: 6 },
      },
    },
  },
  heatmap: {
    chart: { type: 'heatmap' },
    colorAxis: {
      minColor: '#e8f5e9',
      maxColor: BRAND_COLORS.primaryGreen,
    },
  },
  treemap: {
    chart: { type: 'treemap' },
    plotOptions: {
      treemap: {
        layoutAlgorithm: 'squarified',
        dataLabels: { enabled: true },
      },
    },
  },
  radar: {
    chart: { polar: true, type: 'line' },
    xAxis: { tickmarkPlacement: 'on', lineWidth: 0 },
    yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0, min: 0 },
  },
  funnel: {
    chart: { type: 'funnel' },
    plotOptions: {
      funnel: {
        neckWidth: '30%',
        neckHeight: '25%',
        dataLabels: { enabled: true },
      },
    },
  },
  waterfall: {
    chart: { type: 'waterfall' },
    plotOptions: {
      waterfall: {
        dataLabels: { enabled: true },
      },
    },
  },
  boxplot: {
    chart: { type: 'boxplot' },
  },
  bubble: {
    chart: { type: 'bubble' },
    plotOptions: {
      bubble: {
        minSize: 10,
        maxSize: 50,
      },
    },
  },
  gauge: {
    chart: { type: 'gauge' },
    pane: {
      startAngle: -150,
      endAngle: 150,
    },
  },
  sankey: {
    chart: { type: 'sankey' },
  },
};

// Helper to merge theme with chart type defaults
export function getChartOptions(
  chartType: keyof typeof CHART_TYPE_DEFAULTS,
  customOptions: Partial<Highcharts.Options> = {},
  isDarkMode: boolean = false
): Highcharts.Options {
  const baseTheme = isDarkMode 
    ? { ...highchartsTheme, ...highchartsDarkTheme }
    : highchartsTheme;
  
  const typeDefaults = CHART_TYPE_DEFAULTS[chartType] || {};
  
  return {
    ...baseTheme,
    ...typeDefaults,
    ...customOptions,
    chart: {
      ...baseTheme.chart,
      ...(typeDefaults.chart || {}),
      ...(customOptions.chart || {}),
    },
    plotOptions: {
      ...baseTheme.plotOptions,
      ...(typeDefaults.plotOptions || {}),
      ...(customOptions.plotOptions || {}),
    },
  } as Highcharts.Options;
}
