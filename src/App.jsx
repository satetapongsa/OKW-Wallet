import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Bell, 
  Copy, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  History, 
  LayoutGrid, 
  ArrowUpDown, 
  Compass, 
  Target, 
  Rocket, 
  Plus, 
  ChevronDown,
  X,
  TrendingUp,
  RefreshCw,
  Wallet,
  Settings,
  Info,
  Gift,
  PlusSquare,
  Users,
  Ticket,
  ChevronRight,
  TrendingDown,
  Sparkles,
  DollarSign,
  Star,
  PlusCircle,
  BellRing
} from 'lucide-react';

// Custom icons for pixel avatar and robot
const PixelAvatar = () => (
  <div className="w-6 h-6 rounded-md overflow-hidden grid grid-cols-3 grid-rows-3 border border-zinc-800">
    <div className="bg-[#1070e0]"></div>
    <div className="bg-[#f2a900]"></div>
    <div className="bg-[#00c070]"></div>
    <div className="bg-[#00a8a8]"></div>
    <div className="bg-[#4a10e0]"></div>
    <div className="bg-[#f2df00]"></div>
    <div className="bg-[#10a0f0]"></div>
    <div className="bg-[#00c0a0]"></div>
    <div className="bg-[#00c050]"></div>
  </div>
);

const RobotIcon = () => (
  <svg className="w-5 h-5 text-[#D0FF00]" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="10" width="1.5" height="4" rx="0.5" />
    <rect x="20.5" y="10" width="1.5" height="4" rx="0.5" />
    <rect x="8" y="2.5" width="1.5" height="3" />
    <circle cx="8.75" cy="1.75" r="1.25" />
    <rect x="14.5" y="2.5" width="1.5" height="3" />
    <circle cx="15.25" cy="1.75" r="1.25" />
    <rect x="4.5" y="5.5" width="15" height="13" rx="3.5" />
    <rect x="7.5" y="9.5" width="2.5" height="2.5" rx="0.5" fill="black" />
    <rect x="14" y="9.5" width="2.5" height="2.5" rx="0.5" fill="black" />
    <rect x="9.5" y="14" width="5" height="1.5" rx="0.75" fill="black" />
  </svg>
);

const ShieldCheckBadge = () => (
  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#1e2d10] text-[#D0FF00] text-[8px] font-bold">
    ✓
  </span>
);

const MoneyBagBadge = () => (
  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#1e2d10] text-[#D0FF00] text-[8px] font-bold">
    $
  </span>
);

function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState('Crypto'); // Crypto, Strategy, Orders, DeFi (OKX Tab)
  const [bottomNav, setBottomNav] = useState('OKX'); // OKX, Explore, DEX, Tracker, Boost
  const [trackerTab, setTrackerTab] = useState('Overview'); // Overview, Markets, Watchlist, Alerts (Tracker Tab)
  
  // Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('1000');
  const [selectedDepositAsset, setSelectedDepositAsset] = useState('USDT');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isRichProfile, setIsRichProfile] = useState(true); // Default to true so assets aren't $0.00
  const [showMainChart, setShowMainChart] = useState(true); // Show mock line chart by default
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const chartDataSets = {
    '1D': [
      { time: '09:00 AM', value: 28100000 },
      { time: '11:00 AM', value: 28400000 },
      { time: '01:00 PM', value: 28250000 },
      { time: '03:00 PM', value: 28900000 },
      { time: '05:00 PM', value: 28600000 },
      { time: '07:00 PM', value: 29200000 },
      { time: '09:00 PM', value: 28854000 }
    ],
    '1W': [
      { time: 'Mon', value: 27500000 },
      { time: 'Tue', value: 28200000 },
      { time: 'Wed', value: 27900000 },
      { time: 'Thu', value: 28600000 },
      { time: 'Fri', value: 28300000 },
      { time: 'Sat', value: 29100000 },
      { time: 'Sun', value: 28854000 }
    ],
    '1M': [
      { time: 'Week 1', value: 25000000 },
      { time: 'Week 2', value: 26800000 },
      { time: 'Week 3', value: 26100000 },
      { time: 'Week 4', value: 28854000 }
    ],
    '1Y': [
      { time: 'Jan', value: 12000000 },
      { time: 'Mar', value: 15400000 },
      { time: 'May', value: 18200000 },
      { time: 'Jul', value: 22000000 },
      { time: 'Sep', value: 24500000 },
      { time: 'Nov', value: 27200000 },
      { time: 'Dec', value: 28854000 }
    ]
  };

  const getChartPathAndFill = (width = 300, height = 100) => {
    const dataPoints = chartDataSets[selectedTimeframe];
    if (!dataPoints || dataPoints.length === 0) return { linePath: "", fillPath: "", points: [] };
    
    // Scale factor based on current total balance
    const scale = totalBalance > 0 ? (totalBalance / 28854000) : 0;
    
    const scaledPoints = dataPoints.map(d => ({
      ...d,
      value: d.value * scale
    }));
    
    const values = scaledPoints.map(d => d.value);
    const minVal = Math.min(...values) * 0.99;
    const maxVal = Math.max(...values) * 1.01;
    const valRange = maxVal - minVal || 1;
    
    const points = scaledPoints.map((d, index) => {
      const x = (index / (scaledPoints.length - 1)) * width;
      const y = height - ((d.value - minVal) / valRange) * height;
      return { x, y, time: d.time, value: d.value };
    });
    
    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i+1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    
    const fillPath = `${linePath} L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`;
    
    return { linePath, fillPath, points };
  };

  const handleChartMouseMove = (e, points) => {
    if (!points || points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
    if (clientX === undefined) return;
    
    const x = clientX - rect.left;
    const svgWidth = rect.width;
    const scaledX = (x / svgWidth) * 300;
    
    let closest = points[0];
    let minDistance = Math.abs(points[0].x - scaledX);
    
    for (let i = 1; i < points.length; i++) {
      const distance = Math.abs(points[i].x - scaledX);
      if (distance < minDistance) {
        minDistance = distance;
        closest = points[i];
      }
    }
    
    setHoveredPoint(closest);
  };

  // Simulated Trading States
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState('Buy'); // Buy or Sell
  const [selectedTradeAsset, setSelectedTradeAsset] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('100');

  // Watchlist & Alerts States
  const [watchlist, setWatchlist] = useState(['BTC', 'ETH', 'SOL']);
  const [alerts, setAlerts] = useState([]);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertAsset, setAlertAsset] = useState('BTC');
  const [alertCondition, setAlertCondition] = useState('Above'); // Above or Below

  // Coin holdings database
  const [assets, setAssets] = useState([
    { id: 'usdg', name: 'USDG', fullName: 'USDG', amount: 0, price: 1.00, logoColor: 'bg-emerald-600', isUSDG: true },
    { id: 'usdt', name: 'USDT', fullName: 'Tether', amount: 0, price: 1.00, logoColor: 'bg-teal-500', isUSDT: true, apy: 'Up to 5.82% APY' },
    { id: 'usdc', name: 'USDC', fullName: 'USD Coin', amount: 0, price: 1.00, logoColor: 'bg-blue-500', apy: 'Up to 6.6% APY' },
    { id: 'btc', name: 'BTC', fullName: 'Bitcoin', amount: 0, price: 97800.50, logoColor: 'bg-amber-500', change: '+1.38%' },
    { id: 'eth', name: 'ETH', fullName: 'Ethereum', amount: 0, price: 3450.25, logoColor: 'bg-indigo-600', apy: 'Up to 3.62% APY', change: '0.00%' },
    { id: 'okb', name: 'OKB', fullName: 'OKB Token', amount: 0, price: 58.40, logoColor: 'bg-zinc-800', change: '+1.37%' },
    { id: 'sol', name: 'SOL', fullName: 'Solana', amount: 0, price: 172.10, logoColor: 'bg-purple-900', apy: 'Up to 7.68% APY', change: '+2.8%' },
    { id: 'bnb', name: 'BNB', fullName: 'Binance Coin', amount: 0, price: 598.60, logoColor: 'bg-yellow-600', change: '+1.18%' }
  ]);

  // Adjust assets depending on "Rich Mode" toggler
  useEffect(() => {
    if (isRichProfile) {
      setAssets(prev => prev.map(asset => {
        if (asset.name === 'USDG') return { ...asset, amount: 2500000.00 };
        if (asset.name === 'USDT') return { ...asset, amount: 5420500.00 };
        if (asset.name === 'USDC') return { ...asset, amount: 1200350.00 };
        if (asset.name === 'ETH') return { ...asset, amount: 1250.20 };
        if (asset.name === 'BTC') return { ...asset, amount: 154.55 };
        if (asset.name === 'OKB') return { ...asset, amount: 3500.00 };
        if (asset.name === 'SOL') return { ...asset, amount: 18450.00 };
        if (asset.name === 'BNB') return { ...asset, amount: 820.00 };
        return asset;
      }));
    } else {
      setAssets(prev => prev.map(asset => ({ ...asset, amount: 0 })));
    }
  }, [isRichProfile]);

  // Total balance calculation
  const totalBalance = assets.reduce((sum, asset) => sum + (asset.amount * asset.price), 0);

  // Portfolio 24h change calculation
  const get24hChange = () => {
    let oldTotalBalance = 0;
    assets.forEach(asset => {
      const changePct = asset.change ? parseFloat(asset.change.replace('%', '')) : 0;
      const oldPrice = asset.price / (1 + changePct / 100);
      oldTotalBalance += asset.amount * oldPrice;
    });

    const usdChange = totalBalance - oldTotalBalance;
    const percentChange = oldTotalBalance > 0 ? (usdChange / oldTotalBalance) * 100 : 0;

    return {
      usd: usdChange,
      percent: percentChange
    };
  };

  const changeData = get24hChange();

  // Watchlist helper functions
  const toggleWatchlist = (symbol) => {
    setWatchlist(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
    triggerToast(watchlist.includes(symbol) ? `Removed ${symbol} from Watchlist` : `Added ${symbol} to Watchlist`);
  };

  // Add Alert helper
  const handleAddAlert = (e) => {
    e.preventDefault();
    const targetPrice = parseFloat(alertPrice);
    if (isNaN(targetPrice) || targetPrice <= 0) {
      triggerToast('Enter a valid alert price.');
      return;
    }
    const newAlert = {
      id: Date.now(),
      asset: alertAsset,
      price: targetPrice,
      condition: alertCondition,
      active: true
    };
    setAlerts(prev => [newAlert, ...prev]);
    setAlertPrice('');
    triggerToast(`Alert set for ${alertAsset} at $${targetPrice}`);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    triggerToast('Alert deleted.');
  };

  // Simulated live price updates & triggers alerts
  const simulatePriceFluctuations = () => {
    setAssets(prev => prev.map(asset => {
      if (asset.price === 1.00) return asset; // Keep stablecoins flat
      const percentChange = (Math.random() * 2 - 1) * 0.03; // +/- 3% fluctuation
      const newPrice = Math.max(0.01, asset.price * (1 + percentChange));
      
      // Check active alerts for this asset
      alerts.forEach(alert => {
        if (alert.active && alert.asset === asset.name) {
          if (
            (alert.condition === 'Above' && newPrice >= alert.price) ||
            (alert.condition === 'Below' && newPrice <= alert.price)
          ) {
            triggerToast(`🚨 Alert Triggered: ${alert.asset} price crossed $${alert.price}!`);
            alert.active = false; // Deactivate once triggered
          }
        }
      });

      return {
        ...asset,
        price: parseFloat(newPrice.toFixed(2)),
        change: `${percentChange >= 0 ? '+' : ''}${(percentChange * 100).toFixed(2)}%`
      };
    }));
  };

  // Handle mock trade execution
  const handleExecuteTrade = (e) => {
    e.preventDefault();
    const tradeAmountNum = parseFloat(tradeAmount);
    if (isNaN(tradeAmountNum) || tradeAmountNum <= 0) {
      triggerToast('Enter a valid trade amount.');
      return;
    }

    const usdtAsset = assets.find(a => a.name === 'USDT');
    const targetAsset = assets.find(a => a.name === selectedTradeAsset.name);

    if (tradeType === 'Buy') {
      const totalCost = tradeAmountNum * targetAsset.price;
      if (usdtAsset.amount < totalCost) {
        triggerToast(`Insufficient USDT balance! Need $${totalCost.toLocaleString()} USDT.`);
        return;
      }

      setAssets(prev => prev.map(asset => {
        if (asset.name === 'USDT') return { ...asset, amount: asset.amount - totalCost };
        if (asset.name === targetAsset.name) return { ...asset, amount: asset.amount + tradeAmountNum };
        return asset;
      }));
      triggerToast(`Successfully bought ${tradeAmountNum} ${targetAsset.name}!`);
    } else {
      if (targetAsset.amount < tradeAmountNum) {
        triggerToast(`Insufficient ${targetAsset.name} balance to sell!`);
        return;
      }
      const totalEarnings = tradeAmountNum * targetAsset.price;

      setAssets(prev => prev.map(asset => {
        if (asset.name === 'USDT') return { ...asset, amount: asset.amount + totalEarnings };
        if (asset.name === targetAsset.name) return { ...asset, amount: asset.amount - tradeAmountNum };
        return asset;
      }));
      triggerToast(`Successfully sold ${tradeAmountNum} ${targetAsset.name}!`);
    }

    setShowTradeModal(false);
  };

  // Donut chart asset slices calculation
  const getDonutSlices = () => {
    const activeAssets = assets.filter(a => a.amount > 0 && a.name !== 'USDT' && a.name !== 'USDC' && a.name !== 'USDG');
    const totalVal = activeAssets.reduce((sum, asset) => sum + (asset.amount * asset.price), 0);
    
    if (totalVal === 0) return [];
    
    let accumulatedPercent = 0;
    return activeAssets.map(asset => {
      const percentage = ((asset.amount * asset.price) / totalVal) * 100;
      const offset = 100 - accumulatedPercent + 25; // +25 is 12 o'clock offset
      accumulatedPercent += percentage;
      return {
        ...asset,
        percentage,
        offset
      };
    });
  };

  // Helper colors for charts and UI
  const getAssetColor = (name) => {
    switch (name) {
      case 'BTC': return '#F7931A';
      case 'ETH': return '#627EEA';
      case 'SOL': return '#14F195';
      case 'BNB': return '#F3BA2F';
      case 'OKB': return '#D0FF00';
      default: return '#71717a';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('wavy');
    setCopied(true);
    triggerToast('Username copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleAddFunds = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      triggerToast('Please enter a valid amount.');
      return;
    }

    setAssets(prev => prev.map(asset => {
      if (asset.name === selectedDepositAsset) {
        return { ...asset, amount: asset.amount + amountNum };
      }
      return asset;
    }));

    setShowDepositModal(false);
    triggerToast(`Successfully deposited ${amountNum.toLocaleString()} ${selectedDepositAsset}!`);
  };

  const getSparklinePath = () => {
    if (totalBalance === 0) {
      return "M 0 12 L 120 12";
    }
    return "M 0 18 Q 20 8, 40 14 T 80 4 T 120 2";
  };

  return (
    <div className="w-full h-full bg-[#070708] flex items-center justify-center p-0 sm:p-6 md:p-12 overflow-hidden font-sans">
      
      {/* iPhone Device Mockup Shell */}
      <div className="w-full h-full sm:w-[412px] sm:h-[892px] bg-black sm:rounded-[48px] sm:border-[8px] sm:border-[#1F1F22] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative select-none">
        
        {/* Dynamic Island / Status Bar */}
        <div className="hidden sm:flex justify-between items-center px-8 pt-4 pb-2 bg-black text-xs font-semibold text-zinc-400 z-30">
          <span>9:41</span>
          <div className="w-28 h-6 bg-black rounded-full border border-zinc-800 flex items-center justify-center">
            <div className="w-3 h-3 bg-zinc-900 rounded-full mr-2"></div>
            <div className="w-12 h-1 bg-zinc-900 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.79-1.79C9.09 19.64 10.5 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
            </svg>
            <span className="text-[10px] bg-zinc-800 px-1 py-0.5 rounded text-white font-mono">5G</span>
            <div className="w-5 h-2.5 border border-zinc-400 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-zinc-200 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* --- MAIN PAGE ROUTING CONTENT --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* ==================== OKX TAB (WALLET DASHBOARD) ==================== */}
          {bottomNav === 'OKX' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="flex items-center justify-between px-4 py-3 bg-black z-20">
                <button className="flex flex-wrap w-[18px] h-[18px] gap-[3px] focus:outline-none active:scale-90 transition-transform cursor-pointer">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className="w-[4px] h-[4px] bg-white rounded-full"></span>
                  ))}
                </button>

                <div className="flex-1 mx-3 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Crypto, Stocks, address,..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#151516] border border-[#232325] rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3.5">
                  <Globe className="w-5 h-5 stroke-[1.75] text-white cursor-pointer" />
                  <Bell className="w-5 h-5 stroke-[1.75] text-white cursor-pointer" />
                </div>
              </header>

              <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
                
                {/* Profile block */}
                <section className="mt-4 mb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PixelAvatar />
                      <span className="text-[15px] font-bold text-white tracking-wide">wavy</span>
                      <RobotIcon />
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-500 cursor-pointer" />
                      <button onClick={handleCopy} className="p-1 hover:bg-zinc-900 rounded text-zinc-500 hover:text-white active:scale-90">
                        {copied ? <Check className="w-3.5 h-3.5 text-[#D0FF00]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button 
                      onClick={() => setIsRichProfile(!isRichProfile)}
                      className={`flex items-center space-x-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all border ${
                        isRichProfile 
                          ? 'bg-[#D0FF00]/10 border-[#D0FF00] text-[#D0FF00]' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isRichProfile ? "Rich: On" : "Rich: Off"}</span>
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h1 className="text-4xl font-extrabold tracking-tight text-white select-text">
                        ${(hoveredPoint ? hoveredPoint.value : totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h1>
                      <div className="mt-1 flex items-center space-x-1.5 text-xs font-bold text-zinc-500">
                        {hoveredPoint ? (
                          <span className="text-[#D0FF00]">Portfolio Value ({hoveredPoint.time})</span>
                        ) : totalBalance === 0 ? (
                          <span>$0.00 (0.00%)</span>
                        ) : (
                          <span className={changeData.usd >= 0 ? "text-[#D0FF00]" : "text-red-500"}>
                            {changeData.usd >= 0 ? '+' : ''}${changeData.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({changeData.usd >= 0 ? '+' : ''}{changeData.percent.toFixed(2)}%)
                          </span>
                        )}
                        {!hoveredPoint && (
                          <span className="bg-[#1C1C1E] px-1.5 py-0.5 rounded text-[9px] text-zinc-400 font-bold font-sans">1D</span>
                        )}
                      </div>
                    </div>

                    <div className="pr-1">
                      <button 
                        onClick={() => setShowMainChart(!showMainChart)}
                        className={`p-2 rounded-xl transition-all border active:scale-95 cursor-pointer ${
                          showMainChart 
                            ? 'bg-[#D0FF00]/10 border-[#D0FF00] text-[#D0FF00]' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                        title="Toggle main chart"
                      >
                        <TrendingUp className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Chart Section */}
                  {showMainChart && (
                    <div className="bg-[#121213] border border-zinc-900 rounded-2xl p-4 mt-4 transition-all">
                      {/* SVG container */}
                      <div className="relative w-full h-[100px]">
                        <svg 
                          className="w-full h-full overflow-visible cursor-crosshair" 
                          viewBox="0 0 300 100"
                          onMouseMove={(e) => {
                            const { points } = getChartPathAndFill(300, 100);
                            handleChartMouseMove(e, points);
                          }}
                          onTouchMove={(e) => {
                            const { points } = getChartPathAndFill(300, 100);
                            handleChartMouseMove(e, points);
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                          onTouchEnd={() => setHoveredPoint(null)}
                        >
                          <defs>
                            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#D0FF00" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#D0FF00" stopOpacity="0.00" />
                            </linearGradient>
                            <filter id="glow-chart" x="-20%" y="-20%" width="140%" height="140%">
                              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#D0FF00" floodOpacity="0.5" />
                            </filter>
                          </defs>
                          
                          {/* Fill path */}
                          <path
                            d={getChartPathAndFill(300, 100).fillPath}
                            fill="url(#chart-grad)"
                          />
                          
                          {/* Line path */}
                          <path
                            d={getChartPathAndFill(300, 100).linePath}
                            fill="none"
                            stroke="#D0FF00"
                            strokeWidth="2.5"
                            style={{ filter: 'url(#glow-chart)' }}
                          />
                          
                          {/* Hover vertical line and tooltip marker */}
                          {hoveredPoint && (
                            <>
                              <line
                                x1={hoveredPoint.x}
                                y1="0"
                                x2={hoveredPoint.x}
                                y2="100"
                                stroke="#D0FF00"
                                strokeWidth="1"
                                strokeDasharray="2 2"
                                className="opacity-60"
                              />
                              <circle
                                cx={hoveredPoint.x}
                                cy={hoveredPoint.y}
                                r="5"
                                fill="#D0FF00"
                                stroke="black"
                                strokeWidth="1.5"
                                className="drop-shadow-[0_0_4px_rgba(208,255,0,0.8)]"
                              />
                            </>
                          )}
                        </svg>
                      </div>

                      {/* Timeframe Selector & Hover info */}
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-900/60">
                        <div className="flex space-x-1.5">
                          {['1D', '1W', '1M', '1Y'].map((tf) => (
                            <button
                              key={tf}
                              type="button"
                              onClick={() => setSelectedTimeframe(tf)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                selectedTimeframe === tf 
                                  ? 'bg-white text-black' 
                                  : 'bg-[#18181a] text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              {tf}
                            </button>
                          ))}
                        </div>
                        
                        <div className="text-[10px] text-zinc-500 font-bold">
                          {hoveredPoint ? (
                            <span className="text-[#D0FF00] font-mono">{hoveredPoint.time}</span>
                          ) : (
                            <span>Touch graph to explore</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <section className="grid grid-cols-4 gap-2 mb-6">
                  {[
                    { label: 'Send', icon: ArrowUp },
                    { label: 'Receive', icon: ArrowDown },
                    { label: 'History', icon: History },
                    { label: 'More', icon: LayoutGrid },
                  ].map((action, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        if (action.label === 'Receive') setShowDepositModal(true);
                        else triggerToast(`"${action.label}" feature simulated.`);
                      }}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div className="w-[52px] h-[52px] rounded-full bg-[#18181a] border border-zinc-800/40 flex items-center justify-center text-white mb-2 group-hover:bg-zinc-800 group-hover:border-zinc-700 active:scale-95 transition-all">
                        <action.icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      <span className="text-xs text-zinc-400 font-medium group-hover:text-white transition-colors">{action.label}</span>
                    </button>
                  ))}
                </section>

                <section className="mb-6">
                  <div className="relative bg-[#121213] border border-[#222224] rounded-[24px] p-5 overflow-hidden flex flex-col justify-between h-[196px]">
                    <div className="absolute right-0 top-0 bottom-0 w-[160px] pointer-events-none">
                      <div className="absolute left-[20px] top-[40%] w-2 h-2 bg-white rotate-45 opacity-80 animate-pulse"></div>
                      <div className="absolute right-[16px] top-[40px] w-[86px] h-[86px] rounded-full border border-white/10 bg-gradient-to-tr from-white/5 to-white/15 backdrop-blur-[6px] flex items-center justify-center shadow-[inset_0_1px_3px_rgba(255,255,0.2)] z-10">
                        <Plus className="w-7 h-7 text-white stroke-[1.2]" />
                      </div>
                      <div className="absolute right-[-28px] top-[48px] w-[70px] h-[70px] rounded-full bg-[#e8e9eb] opacity-95"></div>
                    </div>

                    <div className="z-10 max-w-[65%]">
                      <span className="text-[12px] font-bold text-[#D0FF00] tracking-wide block mb-1">Trader mode enabled</span>
                      <h2 className="text-[20px] leading-[1.2] font-bold text-white tracking-tight">
                        Start by adding native tokens
                      </h2>
                    </div>

                    <button 
                      onClick={() => setShowDepositModal(true)}
                      className="w-full bg-[#D0FF00] hover:bg-[#c2ed00] text-black font-extrabold text-[15px] py-3.5 rounded-full z-10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-[0_4px_16px_rgba(208,255,0,0.2)] cursor-pointer"
                    >
                      <span>Add funds</span>
                    </button>
                  </div>
                </section>

                <section className="mb-4">
                  <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
                    {['Crypto', 'Strategy', 'Orders', 'DeFi'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-[18px] py-[7px] text-[13px] font-semibold rounded-full transition-all cursor-pointer ${
                          activeTab === tab 
                            ? 'bg-white text-black font-bold shadow' 
                            : 'bg-[#151517] text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </section>

                {activeTab === 'Crypto' ? (
                  <section className="relative">
                    <div className="flex justify-between items-center text-[11px] text-zinc-500 font-bold tracking-wider uppercase px-1 mb-2.5">
                      <span>Name/Amount</span>
                      <button className="flex items-center space-x-1 hover:text-zinc-300">
                        <span>Price</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      {assets.map((asset) => (
                        <div 
                          key={asset.id}
                          className="flex items-center justify-between py-3.5 px-1 hover:bg-zinc-900/30 rounded-xl transition-all group cursor-pointer"
                          onClick={() => {
                            setSelectedDepositAsset(asset.name);
                            setShowDepositModal(true);
                          }}
                        >
                          <div className="flex items-center space-x-3.5">
                            {asset.isUSDG ? (
                              <div className="w-10 h-10 rounded-full bg-[#20B060] flex items-center justify-center text-white text-[17px] font-bold shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.78 0 3.48-.47 4.96-1.28L15 18.8c-.9.5-1.93.8-3 .8-3.97 0-7.2-3.23-7.2-7.2s3.23-7.2 7.2-7.2c2.8 0 5.23 1.6 6.4 3.9h-6.4v3.5h10.4c.3-1 .5-2.1.5-3.3 0-5.52-4.48-10-10-10z"/>
                                </svg>
                              </div>
                            ) : asset.isUSDT ? (
                              <div className="w-10 h-10 rounded-full bg-[#26A17B] flex items-center justify-center text-white text-[17px] font-bold shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform">
                                <span className="font-sans">₮</span>
                              </div>
                            ) : asset.name === 'USDC' ? (
                              <div className="w-10 h-10 rounded-full bg-[#2775CA] flex items-center justify-center text-white text-[15px] font-extrabold shadow-md group-hover:scale-105 transition-transform">
                                S
                              </div>
                            ) : asset.name === 'BTC' ? (
                              <div className="w-10 h-10 rounded-full bg-[#F7931A] flex items-center justify-center text-white text-[16px] font-extrabold shadow-md group-hover:scale-105 transition-transform">
                                ₿
                              </div>
                            ) : asset.name === 'ETH' ? (
                              <div className="w-10 h-10 rounded-full bg-[#627EEA] flex items-center justify-center text-white text-[16px] font-extrabold shadow-md group-hover:scale-105 transition-transform">
                                Ξ
                              </div>
                            ) : asset.name === 'SOL' ? (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] flex items-center justify-center text-black text-[12px] font-black shadow-md group-hover:scale-105 transition-transform">
                                S
                              </div>
                            ) : asset.name === 'BNB' ? (
                              <div className="w-10 h-10 rounded-full bg-[#F3BA2F] flex items-center justify-center text-black text-[14px] font-bold shadow-md group-hover:scale-105 transition-transform">
                                B
                              </div>
                            ) : (
                              <div className={`w-10 h-10 rounded-full ${asset.logoColor} flex items-center justify-center text-white text-[13px] font-extrabold shadow-md group-hover:scale-105 transition-transform`}>
                                {asset.name.substring(0, 2)}
                              </div>
                            )}
                            
                            <div>
                              <div className="flex items-center space-x-1.5 flex-wrap">
                                <span className="text-[15px] font-bold text-white leading-tight">{asset.name}</span>
                                {asset.apy && (
                                  <span className="bg-[#102a12] text-[#D0FF00] text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    {asset.apy}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-zinc-500 font-semibold leading-tight block">
                                {asset.amount.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[15px] font-bold text-white block">
                              ${(asset.amount * asset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            
                            {asset.change && (
                              <span className={`text-[11px] font-bold block mt-0.5 ${
                                asset.change.startsWith('+') ? 'text-[#D0FF00]' : 'text-red-500'
                              }`}>
                                ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                <span className="ml-1 text-[10px] font-medium font-sans">({asset.change})</span>
                              </span>
                            )}
                            {!asset.change && (
                              <span className="text-[11px] text-zinc-500 font-semibold block mt-0.5">
                                ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-6 mb-2">
                      <button className="flex items-center space-x-2 bg-[#1A1A1C] border border-[#2B2B2D] px-5 py-2.5 rounded-full hover:bg-zinc-800 active:scale-95 transition-all text-xs font-bold text-white shadow-md cursor-pointer">
                        <Settings className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Manage crypto</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-[#101011] border border-zinc-900 rounded-2xl p-4 mt-6">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-zinc-400" />
                        </div>
                        <span className="text-xs font-bold text-white">OKX Wallet</span>
                      </div>
                      <button className="bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-300 py-1.5 px-4 rounded-full border border-zinc-800 cursor-pointer">
                        Manage
                      </button>
                    </div>
                  </section>
                ) : (
                  <div className="bg-[#121213] border border-dashed border-zinc-800 rounded-2xl py-8 px-4 text-center">
                    <p className="text-sm text-zinc-500 font-medium">No items in {activeTab}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== EXPLORE TAB ==================== */}
          {bottomNav === 'Explore' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-black">
              <header className="flex items-center justify-between px-4 py-3 bg-black z-20">
                <h1 className="text-[26px] font-extrabold text-white tracking-tight">Explore</h1>
                <div className="flex items-center space-x-3.5 text-white">
                  <PlusSquare className="w-6 h-6 stroke-[1.8] cursor-pointer active:scale-95 transition-transform" />
                  <Gift className="w-6 h-6 stroke-[1.8] cursor-pointer active:scale-95 transition-transform" />
                </div>
              </header>

              <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
                <div className="relative my-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Crypto, Stocks, address, DApp"
                    className="w-full bg-[#151516] border border-[#232325] rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    disabled
                  />
                </div>

                <section className="mt-4">
                  <h3 className="text-[17px] font-bold text-white tracking-wide mb-3">Hot categories</h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'OKX Boost', pct: '+14.76%', data: [10, 12, 10, 11, 14, 13, 16] },
                      { name: 'SpaceX Ins...', pct: '+4.23%', data: [8, 8, 9, 8, 9, 11, 13] },
                      { name: 'Storage/O...', pct: '+5.21%', data: [9, 8, 8, 12, 12, 11, 14] },
                      { name: 'X Picks', pct: '+1.09%', data: [11, 10, 10, 14, 10, 13, 9] },
                      { name: 'Earnings S...', pct: '+0.62%', data: [12, 10, 10, 9, 12, 11, 14] },
                      { name: 'Web3 AI C...', pct: '+2.99%', data: [9, 12, 11, 13, 12, 13, 11] },
                    ].map((cat, idx) => (
                      <div key={idx} className="bg-[#121213] border border-[#1e1e20] rounded-[16px] p-3 flex flex-col justify-between h-[96px]">
                        <div>
                          <div className="text-[11px] font-bold text-zinc-200 tracking-tight leading-tight truncate">{cat.name}</div>
                          <div className="text-[10px] font-bold text-[#D0FF00] mt-0.5">{cat.pct}</div>
                        </div>
                        <div className="h-6 mt-1 flex items-end">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
                            <path
                              d={`M 0 ${cat.data[0] * 1.3} L 16 ${cat.data[1] * 1.3} L 32 ${cat.data[2] * 1.3} L 48 ${cat.data[3] * 1.3} L 64 ${cat.data[4] * 1.3} L 80 ${cat.data[5] * 1.3} L 100 ${cat.data[6] * 1.3}`}
                              fill="none"
                              stroke="#D0FF00"
                              strokeWidth="1.5"
                              className="drop-shadow-[0_1px_2px_rgba(208,255,0,0.4)]"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-[22px] font-black text-white">Crypto</h2>
                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <button className="w-8 h-8 rounded-full bg-[#151517] flex items-center justify-center text-zinc-400">
                        ★
                      </button>
                      <button className="px-4.5 py-1.5 bg-[#151517] text-zinc-400 text-xs font-bold rounded-full">
                        Top
                      </button>
                      <button className="px-4.5 py-1.5 bg-white text-black text-xs font-extrabold rounded-full">
                        Trending
                      </button>
                    </div>
                    <Globe className="w-5 h-5 text-zinc-400 cursor-pointer" />
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'Jotchua', price: '$0.0038731', change: '+2.06%', mc: '$3.87M', vol: '$488.76K', badges: ['shield', 'money', 'people', 'wolf'], avatar: '🐶' },
                      { name: 'SPCX', price: '$0.00033433', change: '-10.17%', mc: '$334.33K', vol: '$11.06K', badges: ['money', 'lightning'], avatar: '🚀' },
                      { name: 'WORLDCUP', price: '$0.00075361', change: '+10.55%', mc: '$7.53M', vol: '$348.1K', badges: ['shield', 'money', 'wolf'], avatar: '🏆' },
                      { name: 'U', price: '$0.99934', change: '+0.12%', mc: '$1.25M', vol: '$15.4K', badges: ['shield', 'money'], avatar: '🇺' }
                    ].map((coin, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 group cursor-pointer hover:bg-zinc-900/20 px-1 rounded-xl transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-lg select-none group-hover:scale-105 transition-transform">
                            {coin.avatar}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1 flex-wrap">
                              <span className="text-[15px] font-bold text-white">{coin.name}</span>
                              {coin.badges.includes('shield') && <ShieldCheckBadge />}
                              {coin.badges.includes('money') && <MoneyBagBadge />}
                              {coin.badges.includes('people') && <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-zinc-800 text-[8px]">👥</span>}
                              {coin.badges.includes('wolf') && <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-zinc-800 text-[8px]">🐺</span>}
                              {coin.badges.includes('lightning') && <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-zinc-800 text-[8px]">⚡</span>}
                            </div>
                            <span className="text-[11px] text-zinc-500 font-bold block mt-0.5">
                              MC {coin.mc} <span className="text-zinc-700 mx-0.5">•</span> Vol {coin.vol}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[15px] font-bold text-white block">{coin.price}</span>
                          <span className={`text-[11px] font-bold block mt-0.5 ${
                            coin.change.startsWith('+') ? 'text-[#D0FF00]' : 'text-red-500'
                          }`}>{coin.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ==================== TRACKER TAB (CUSTOM DESIGNED) ==================== */}
          {bottomNav === 'Tracker' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-black text-white">
              {/* Header */}
              <header className="flex items-center justify-between px-4 py-3 bg-black z-20">
                <h1 className="text-[26px] font-extrabold text-white tracking-tight">Tracker</h1>
                <button 
                  onClick={simulatePriceFluctuations}
                  className="flex items-center space-x-1 bg-[#1c2d10] border border-[#D0FF00]/20 text-[#D0FF00] text-xs font-extrabold px-3 py-1.5 rounded-full hover:bg-emerald-950 active:scale-95 transition-all"
                  title="Simulate live market movement"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Update Prices</span>
                </button>
              </header>

              {/* Tracker Submenu Tabs */}
              <div className="border-b border-zinc-900 px-4">
                <div className="flex space-x-5 py-1">
                  {['Overview', 'Markets', 'Watchlist', 'Alerts'].map(sub => (
                    <button
                      key={sub}
                      onClick={() => setTrackerTab(sub)}
                      className={`text-sm py-2 font-bold transition-all relative ${
                        trackerTab === sub ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {sub}
                      {trackerTab === sub && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D0FF00] rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 pt-2">
                
                {/* 1. OVERVIEW SECTION */}
                {trackerTab === 'Overview' && (
                  <div className="space-y-6">
                    {/* Donut Allocation card */}
                    <div className="bg-[#121213] border border-zinc-900 rounded-2xl p-5">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Portfolio Distribution</h3>
                      
                      {getDonutSlices().length > 0 ? (
                        <div className="flex items-center justify-between">
                          {/* Dynamic SVG Donut Chart */}
                          <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                              <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#1f1f22" strokeWidth="4.2" />
                              {getDonutSlices().map((slice, i) => (
                                <circle
                                  key={i}
                                  cx="21"
                                  cy="21"
                                  r="15.9155"
                                  fill="transparent"
                                  stroke={getAssetColor(slice.name)}
                                  strokeWidth="4.2"
                                  strokeDasharray={`${slice.percentage} ${100 - slice.percentage}`}
                                  strokeDashoffset={slice.offset}
                                  className="transition-all duration-500"
                                />
                              ))}
                            </svg>
                            {/* Inner Balance text */}
                            <div className="absolute text-center">
                              <span className="text-[10px] text-zinc-500 font-bold block">Assets</span>
                              <span className="text-sm font-black text-white">
                                {assets.filter(a => a.amount > 0 && a.name !== 'USDT' && a.name !== 'USDC').length} Coins
                              </span>
                            </div>
                          </div>

                          {/* Legend list */}
                          <div className="flex-1 ml-6 space-y-2 max-h-[140px] overflow-y-auto no-scrollbar">
                            {getDonutSlices().map((slice, i) => (
                              <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getAssetColor(slice.name) }}></span>
                                  <span className="font-bold text-white">{slice.name}</span>
                                </div>
                                <span className="font-mono text-zinc-400 font-semibold">{slice.percentage.toFixed(1)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-zinc-500 text-sm">
                          <Wallet className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
                          <span>No crypto assets held. Add mock funds to view allocation!</span>
                        </div>
                      )}
                    </div>

                    {/* Stats overview card */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#121213] border border-zinc-900 p-4 rounded-xl">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block">Total Net Worth</span>
                        <span className="text-xl font-extrabold text-white block mt-1">${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="bg-[#121213] border border-zinc-900 p-4 rounded-xl">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block">Stablecoins</span>
                        <span className="text-xl font-extrabold text-[#D0FF00] block mt-1">
                          ${assets
                            .filter(a => a.name === 'USDT' || a.name === 'USDC' || a.name === 'USDG')
                            .reduce((sum, a) => sum + (a.amount * a.price), 0)
                            .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MARKETS / SIMULATOR SECTION */}
                {trackerTab === 'Markets' && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Live Simulator Markets</p>
                    
                    {assets.filter(a => a.name !== 'USDG' && a.name !== 'USDC').map((asset) => (
                      <div 
                        key={asset.id} 
                        className="bg-[#121213] border border-zinc-900 rounded-xl p-3.5 flex items-center justify-between hover:border-zinc-800 transition-colors"
                      >
                        {/* Left Details */}
                        <div className="flex items-center space-x-3">
                          <button onClick={() => toggleWatchlist(asset.name)} className="text-zinc-600 hover:text-yellow-500 transition-colors">
                            <Star className={`w-4 h-4 ${watchlist.includes(asset.name) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          </button>
                          
                          <div>
                            <span className="text-sm font-bold text-white block">{asset.name}</span>
                            <span className="text-[10px] text-zinc-500 font-bold block">{asset.fullName}</span>
                          </div>
                        </div>

                        {/* Mid Sparkline */}
                        <div className="w-16 h-8 flex items-center">
                          <svg className="w-full h-full" viewBox="0 0 100 20">
                            <path 
                              d={asset.change && asset.change.startsWith('-') ? "M 0 5 Q 30 18, 60 10 T 100 18" : "M 0 18 Q 30 5, 60 12 T 100 2"}
                              fill="none" 
                              stroke={asset.change && asset.change.startsWith('-') ? "#ef4444" : "#D0FF00"} 
                              strokeWidth="1.5"
                            />
                          </svg>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <span className="text-sm font-bold text-white block">${asset.price.toLocaleString()}</span>
                            <span className={`text-[10px] font-bold block ${
                              asset.change && asset.change.startsWith('+') ? 'text-[#D0FF00]' : 'text-red-500'
                            }`}>{asset.change || '0.00%'}</span>
                          </div>
                          
                          {/* Action Buttons for simulator trade */}
                          {asset.name !== 'USDT' && (
                            <div className="flex flex-col space-y-1">
                              <button 
                                onClick={() => {
                                  setSelectedTradeAsset(asset);
                                  setTradeType('Buy');
                                  setTradeAmount('1');
                                  setShowTradeModal(true);
                                }}
                                className="bg-[#D0FF00] hover:bg-[#c2ed00] text-black text-[10px] font-black px-3 py-1 rounded-md active:scale-95 transition-all"
                              >
                                Buy
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedTradeAsset(asset);
                                  setTradeType('Sell');
                                  setTradeAmount('1');
                                  setShowTradeModal(true);
                                }}
                                className="bg-zinc-800 hover:bg-zinc-700 text-red-400 text-[10px] font-black px-3 py-1 rounded-md border border-zinc-700 active:scale-95 transition-all"
                              >
                                Sell
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. WATCHLIST SECTION */}
                {trackerTab === 'Watchlist' && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Custom Watchlist</p>
                    
                    {watchlist.length > 0 ? (
                      assets.filter(a => watchlist.includes(a.name)).map(asset => (
                        <div key={asset.id} className="bg-[#121213] border border-zinc-900 rounded-xl p-3.5 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button onClick={() => toggleWatchlist(asset.name)} className="text-yellow-500">
                              <Star className="w-4 h-4 fill-yellow-500" />
                            </button>
                            <div>
                              <span className="text-sm font-bold text-white block">{asset.name}</span>
                              <span className="text-[10px] text-zinc-500 font-semibold block">{asset.fullName}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-white block">${asset.price.toLocaleString()}</span>
                            <span className={`text-[10px] font-bold block ${
                              asset.change && asset.change.startsWith('+') ? 'text-[#D0FF00]' : 'text-red-500'
                            }`}>{asset.change || '0.00%'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-zinc-600 text-sm">
                        <Star className="w-8 h-8 mx-auto mb-2 text-zinc-800" />
                        <span>No assets in watchlist. Star them in Markets tab!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. ALERTS CONFIGURATION */}
                {trackerTab === 'Alerts' && (
                  <div className="space-y-4">
                    {/* Add Alert Form */}
                    <div className="bg-[#121213] border border-zinc-900 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Create Price Alert</h4>
                      
                      <form onSubmit={handleAddAlert} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {/* Asset Select */}
                          <div>
                            <label className="text-[10px] font-bold text-zinc-500 block mb-1">Select Asset</label>
                            <select 
                              value={alertAsset} 
                              onChange={(e) => setAlertAsset(e.target.value)}
                              className="w-full bg-[#18181a] border border-zinc-800 rounded-lg p-2 text-xs font-bold text-white focus:outline-none"
                            >
                              {assets.filter(a => a.name !== 'USDT' && a.name !== 'USDC' && a.name !== 'USDG').map(a => (
                                <option key={a.name} value={a.name}>{a.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* Condition Select */}
                          <div>
                            <label className="text-[10px] font-bold text-[#b5aebf] block mb-1">Condition</label>
                            <select 
                              value={alertCondition} 
                              onChange={(e) => setAlertCondition(e.target.value)}
                              className="w-full bg-[#18181a] border border-zinc-800 rounded-lg p-2 text-xs font-bold text-white focus:outline-none"
                            >
                              <option value="Above">Goes Above (≥)</option>
                              <option value="Below">Goes Below (≤)</option>
                            </select>
                          </div>
                        </div>

                        {/* Price Input */}
                        <div>
                          <label className="text-[10px] font-bold text-[#b5aebf] block mb-1">Target Price (USD)</label>
                          <input 
                            type="number"
                            value={alertPrice}
                            onChange={(e) => setAlertPrice(e.target.value)}
                            placeholder={`Current: $${assets.find(a => a.name === alertAsset).price}`}
                            className="w-full bg-[#18181a] border border-zinc-800 rounded-lg p-2 text-xs font-bold text-white focus:outline-none"
                            required
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="w-full bg-[#D0FF00] hover:bg-[#c2ed00] text-black font-extrabold py-2.5 rounded-lg text-xs active:scale-[0.98] transition-all cursor-pointer text-center"
                        >
                          Set Alert Notification
                        </button>
                      </form>
                    </div>

                    {/* Active Alerts List */}
                    <div>
                      <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Active Alerts ({alerts.length})</p>
                      
                      {alerts.length > 0 ? (
                        <div className="space-y-2">
                          {alerts.map(a => (
                            <div key={a.id} className="bg-[#121213] border border-zinc-900 rounded-lg p-3 flex justify-between items-center text-xs">
                              <div className="flex items-center space-x-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${a.active ? 'bg-green-500' : 'bg-zinc-600'}`}></span>
                                <span className="font-bold text-white">{a.asset}</span>
                                <span className="text-zinc-500">{a.condition === 'Above' ? '≥' : '≤'}</span>
                                <span className="font-mono text-zinc-300 font-semibold">${a.price.toLocaleString()}</span>
                              </div>
                              <button onClick={() => removeAlert(a.id)} className="text-zinc-500 hover:text-red-400">
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-zinc-700 text-xs font-semibold">
                          No active price alerts set
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ==================== BOOST TAB ==================== */}
          {bottomNav === 'Boost' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-black text-white">
              <header className="flex items-center justify-between px-4 py-3 bg-black z-20">
                <h1 className="text-[26px] font-extrabold text-white tracking-tight">Boost</h1>
                <div className="flex items-center space-x-3.5">
                  <Users className="w-5.5 h-5.5 text-white cursor-pointer" />
                  <Ticket className="w-5.5 h-5.5 text-white cursor-pointer" />
                </div>
              </header>

              <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
                <section className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-5 mb-5 mt-2 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Boost volume</span>
                    <span className="text-3xl font-extrabold text-white block mt-1">$0</span>
                  </div>
                  <button className="bg-[#1A1A1C] hover:bg-zinc-800 text-xs font-bold text-zinc-300 py-2.5 px-4 rounded-full border border-zinc-800/80 cursor-pointer">
                    View details
                  </button>
                </section>

                <section className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 mb-5">
                  {[
                    { name: 'BILL', pct: '+50%', color: 'bg-blue-600', sym: 'B' },
                    { name: 'SLX', pct: '+50%', color: 'bg-purple-600', sym: '%' },
                    { name: 'RIVER', pct: '+50%', color: 'bg-cyan-600', sym: 'R' }
                  ].map((tok, i) => (
                    <div key={i} className="flex items-center space-x-2 bg-[#121213] border border-zinc-850 px-3.5 py-2 rounded-full flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full ${tok.color} flex items-center justify-center text-[10px] font-bold`}>
                        {tok.sym}
                      </div>
                      <span className="text-xs font-extrabold text-zinc-200">{tok.name}</span>
                      <span className="text-[10px] font-black text-[#D0FF00]">{tok.pct}</span>
                    </div>
                  ))}
                </section>

                <section className="mb-6">
                  <div className="relative bg-gradient-to-br from-[#0c4a6e] via-[#0f766e] to-[#065f46] border border-white/5 rounded-[24px] p-5 h-[230px] flex flex-col justify-between overflow-hidden shadow-xl">
                    <div className="absolute right-0 top-0 bottom-0 w-[170px] pointer-events-none">
                      <div className="absolute right-[-10px] top-[20px] w-24 h-24 rounded-full bg-cyan-400/20 blur-xl"></div>
                      <div className="absolute right-[10px] top-[30px] w-[90px] h-[90px] rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg rotate-12">
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#14F195] to-[#D0FF00] drop-shadow-[0_2px_8px_rgba(20,241,149,0.5)]">X</span>
                      </div>
                    </div>

                    <div className="z-10">
                      <span className="text-xs font-semibold text-cyan-300 block mb-1">X Campaign</span>
                      <h2 className="text-2xl font-black leading-tight text-white tracking-tight max-w-[70%]">
                        Win a share of 300K USDC
                      </h2>
                    </div>

                    <div className="z-10 flex justify-between items-center mt-4">
                      <div>
                        <div className="flex items-center space-x-2 bg-black/30 border border-white/10 px-2.5 py-1 rounded-md">
                          <span className="text-[10px] font-bold text-teal-300">xStocks</span>
                          <span className="text-[9px] text-zinc-300 font-medium font-mono">Ends in: 12D 5h</span>
                        </div>
                      </div>

                      <button className="bg-white hover:bg-zinc-100 text-black font-extrabold text-xs px-5 py-2.5 rounded-full shadow active:scale-95 transition-all cursor-pointer">
                        Join
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center items-center space-x-1.5 mt-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                  </div>
                </section>

                <section className="mb-6">
                  <div className="bg-[#121213] border border-zinc-900 rounded-[20px] p-4 flex justify-between items-center cursor-pointer hover:border-zinc-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#1e2d10] flex items-center justify-center">
                        <Rocket className="w-4.5 h-4.5 text-[#D0FF00]" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">X Launch</span>
                        <span className="text-[11px] text-zinc-500 font-semibold block mt-0.5">Explore premium launchpad events</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-500" />
                  </div>
                </section>
              </div>
            </div>
          )}

        </div>

        {/* --- BOTTOM FIXED NAVIGATION BAR --- */}
        <footer className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-zinc-900/60 pb-5 pt-2 px-1 z-30">
          <div className="flex justify-between items-end relative px-2">
            
            <button 
              onClick={() => setBottomNav('OKX')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 cursor-pointer ${
                bottomNav === 'OKX' ? 'text-[#D0FF00]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Wallet className="w-5 h-5 mb-1 stroke-[2]" />
              <span className="text-[10px] font-bold tracking-tight">OKX</span>
            </button>

            <button 
              onClick={() => setBottomNav('Explore')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 cursor-pointer ${
                bottomNav === 'Explore' ? 'text-[#D0FF00]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Compass className="w-5 h-5 mb-1 stroke-[2]" />
              <span className="text-[10px] font-bold tracking-tight">Explore</span>
            </button>

            {/* Elevated circular DEX button */}
            <div className="flex-1 flex flex-col items-center justify-center relative -top-3 cursor-pointer">
              <button 
                onClick={() => {
                  setBottomNav('OKX');
                  setShowDepositModal(true);
                }}
                className="w-14 h-14 rounded-full bg-[#D0FF00] border-4 border-black flex items-center justify-center text-black shadow-[0_4px_15px_rgba(208,255,0,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                <ArrowUpDown className="w-5 h-5 stroke-[2.5]" />
              </button>
              <span className="text-[10px] font-bold tracking-tight mt-1 text-zinc-500">DEX</span>
            </div>

            <button 
              onClick={() => setBottomNav('Tracker')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 cursor-pointer ${
                bottomNav === 'Tracker' ? 'text-[#D0FF00]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Target className="w-5 h-5 mb-1 stroke-[2]" />
              <span className="text-[10px] font-bold tracking-tight">Tracker</span>
            </button>

            <button 
              onClick={() => setBottomNav('Boost')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 cursor-pointer ${
                bottomNav === 'Boost' ? 'text-[#D0FF00]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Rocket className="w-5 h-5 mb-1 stroke-[2]" />
              <span className="text-[10px] font-bold tracking-tight">Boost</span>
            </button>

          </div>
        </footer>

        {/* --- SIMULATED TRADING MODAL (BUY/SELL SCREEN) --- */}
        {showTradeModal && selectedTradeAsset && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end justify-center p-4 transition-all duration-300">
            <div className="bg-[#121213] border border-zinc-800 rounded-t-[28px] rounded-b-xl w-full p-6 text-white shadow-2xl pb-8 translate-y-0 transition-transform">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold">{tradeType} {selectedTradeAsset.name}</h3>
                  <p className="text-xs text-zinc-500">Simulate trade against your wallet balance</p>
                </div>
                <button 
                  onClick={() => setShowTradeModal(false)}
                  className="p-1.5 bg-zinc-900 rounded-full text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleExecuteTrade}>
                {/* Available Balance Stats */}
                <div className="bg-[#18181a] border border-zinc-900 rounded-xl p-3.5 mb-4 text-xs flex justify-between">
                  <div>
                    <span className="text-zinc-500 block">Available USDT</span>
                    <span className="font-extrabold text-white mt-0.5 block">
                      ${assets.find(a => a.name === 'USDT').amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500 block">Available {selectedTradeAsset.name}</span>
                    <span className="font-extrabold text-white mt-0.5 block">
                      {assets.find(a => a.name === selectedTradeAsset.name).amount.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                    </span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="relative mb-6">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Quantity to {tradeType}</label>
                  <input 
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="w-full bg-[#1A1A1C] border border-zinc-800 rounded-xl py-4 pl-4 pr-16 text-lg font-bold text-white focus:outline-none"
                    placeholder="0.00"
                    step="any"
                    min="0.000001"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[#D0FF00] text-sm mt-2">
                    {selectedTradeAsset.name}
                  </span>
                </div>

                {/* Calculation Info */}
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-400 mb-6 px-1">
                  <span>Est. Transaction Cost</span>
                  <span className="font-mono text-white">
                    ${(parseFloat(tradeAmount || 0) * selectedTradeAsset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                  </span>
                </div>

                {/* Execute Button */}
                <button
                  type="submit"
                  className={`w-full text-black font-extrabold py-4 rounded-xl active:scale-98 transition-all cursor-pointer text-center ${
                    tradeType === 'Buy' 
                      ? 'bg-[#D0FF00] hover:bg-[#c2ed00]' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Confirm {tradeType}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- INTERACTIVE DEPOSIT MODAL --- */}
        {showDepositModal && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end justify-center p-4 transition-all duration-300">
            <div className="bg-[#121213] border border-zinc-800 rounded-t-[28px] rounded-b-xl w-full p-6 text-white shadow-2xl pb-8 translate-y-0 transition-transform">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold">Add Simulated Funds</h3>
                  <p className="text-xs text-zinc-500">Select token and load simulated balance</p>
                </div>
                <button 
                  onClick={() => setShowDepositModal(false)}
                  className="p-1.5 bg-zinc-900 rounded-full text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddFunds}>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Select Asset</label>
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {assets.map(asset => (
                    <button
                      type="button"
                      key={asset.id}
                      onClick={() => setSelectedDepositAsset(asset.name)}
                      className={`py-2 px-1 rounded-xl text-center border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                        selectedDepositAsset === asset.name 
                          ? 'border-[#D0FF00] bg-[#D0FF00]/5 text-white' 
                          : 'border-zinc-800 bg-[#161617] text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs">{asset.name}</span>
                      <span className="text-[9px] text-zinc-500 font-medium block mt-0.5">${asset.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Amount to Deposit</label>
                <div className="relative mb-6">
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-[#1A1A1C] border border-zinc-800 rounded-xl py-4.5 pl-4 pr-12 text-lg font-bold text-white focus:outline-none"
                    placeholder="Enter amount"
                    min="1"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-zinc-500 text-sm">
                    {selectedDepositAsset}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D0FF00] text-black font-extrabold py-4 rounded-xl active:scale-98 transition-all hover:bg-[#c2ed00] cursor-pointer text-center"
                >
                  Confirm Deposit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- CUSTOM APP TOASTS --- */}
        {showToast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-lg z-50 flex items-center space-x-2 transition-all">
            <div className="w-1.5 h-1.5 bg-[#D0FF00] rounded-full animate-ping"></div>
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
