"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  MOCK_USER, 
  MOCK_MATCHES, 
  MOCK_MOMENTS, 
  MOCK_MY_CAPTURES, 
  SUGGESTED_CHALLENGES, 
  Moment, 
  Match 
} from '../data/mockData';

// Notification interface
interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon: string;
  type: 'goal' | 'sale' | 'trend';
  momentId?: string;
}

export default function Home() {
  // Navigation & Screen States
  const [screen, setScreen] = useState<'onboarding' | 'marketplace' | 'snap' | 'trending' | 'profile' | 'detail'>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [previousScreen, setPreviousScreen] = useState<'marketplace' | 'trending' | 'profile'>('marketplace');
  
  // App Global State (Mocking wallet and dynamic assets)
  const [userWallet, setUserWallet] = useState(MOCK_USER);
  const [moments, setMoments] = useState<Moment[]>(MOCK_MOMENTS);
  const [myCaptures, setMyCaptures] = useState<Moment[]>(MOCK_MY_CAPTURES);
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('ALL');
  const [marketTab, setMarketTab] = useState<'FOR_YOU' | 'TRENDING' | 'LIVE'>('FOR_YOU');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Onboarding Wallet Generation Simulation
  const [isWalletGenerating, setIsWalletGenerating] = useState(false);
  const [walletGenStatus, setWalletGenStatus] = useState('');
  
  // Real Permission States
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Camera & Snap Flow States
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<{ type: 'photo' | 'video'; url: string } | null>(null);
  const [suggestedCheckIn, setSuggestedCheckIn] = useState<string>('Emirates Stadium (Derby Match)');
  const [activeCaptureTag, setActiveCaptureTag] = useState('Goal');
  
  // Capture Edit & Minting States
  const [captureCaption, setCapturedCaption] = useState('');
  const [captureCategory, setCaptureCategory] = useState<'GOAL' | 'SAVE' | 'CELEBRATION' | 'CROWD' | 'TENSION'>('GOAL');
  const [captureRarity, setCaptureRarity] = useState<'CORE' | 'RARE' | 'EPIC' | 'LEGENDARY'>('CORE');
  const [curationScore, setCurationScore] = useState<number | null>(null);
  const [isCurationScanning, setIsCurationScanning] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStatus, setMintingStatus] = useState('');
  
  // Purchase Transaction State
  const [isBuying, setIsBuying] = useState(false);
  const [buyStatus, setBuyStatus] = useState('');
  const [buySuccess, setBuySuccess] = useState(false);

  // Push Notifications State
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<PushNotification | null>(null);

  // Profile View Tabs
  const [profileTab, setProfileTab] = useState<'CAPTURES' | 'COLLECTION'>('CAPTURES');

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound Engine (Web Audio API)
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSound = (type: 'click' | 'success' | 'alert') => {
    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state === 'suspended') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        // Shutter click sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        // Retro coin success sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.45);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'alert') {
        // Subtle reminder alert
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.15);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn("AudioContext failed to play sound: ", e);
    }
  };

  // Simulated Push Notifications Engine
  useEffect(() => {
    if (screen === 'onboarding') return;

    const messages = [
      {
        title: "⚽ GOAL at Etihad Stadium!",
        body: "Haaland equalizes! Capturers in Section 102 report massive action. Open camera to snap it now!",
        icon: "sports_soccer",
        type: 'goal' as const
      },
      {
        title: "🔥 Trending Spiker!",
        body: "'The Kop Erupts' resale price just spiked +18% on the live market.",
        icon: "local_fire_department",
        type: 'trend' as const
      },
      {
        title: "🎟️ Moment Sold!",
        body: "Your moment 'Crowd Eruption 90+4'' was purchased by @PSG_Fan for 150 BAR!",
        icon: "token",
        type: 'sale' as const
      }
    ];

    const interval = setInterval(() => {
      // Trigger notification randomly (25% chance every 25 seconds)
      if (Math.random() > 0.4 && !activeNotification) {
        const randMsg = messages[Math.floor(Math.random() * messages.length)];
        const newNotif: PushNotification = {
          id: Math.random().toString(),
          ...randMsg
        };
        
        // Custom sound alert
        playSound('alert');
        setActiveNotification(newNotif);

        // Auto hide after 8 seconds
        setTimeout(() => {
          setActiveNotification(null);
        }, 8000);
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [screen, activeNotification]);

  // Requesting Location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission('granted');
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Match checking based on coordinates
          setSuggestedCheckIn('Emirates Stadium (London Derby)');
        },
        (error) => {
          console.error("Location permission denied: ", error);
          setLocationPermission('denied');
        }
      );
    } else {
      setLocationPermission('denied');
    }
  };

  // Requesting Camera and mounting stream
  const requestCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      setCameraPermission('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.log("Video playback delayed:", err));
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable: ", err);
      setCameraPermission('denied');
    }
  };

  // Clean up camera on screen change
  useEffect(() => {
    if (screen !== 'snap') {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    } else if (cameraPermission === 'granted') {
      requestCamera();
    }
  }, [screen, cameraPermission]);

  // Recording Timer Effect
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 30) {
            handleStopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }

    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    initAudio();
    playSound('click');
    setIsRecording(true);
    setRecordingSeconds(0);
  };

  const handleStopRecording = () => {
    playSound('click');
    setIsRecording(false);
    // Simulate captured video url
    setCapturedMedia({
      type: 'video',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp-0m-z5pyKSlosc0TfExp1M5kBDknuqZvttFjKpylsgxw-FPgmmJYbZSy-AoCxXl7v3oFvqW1XJER4tU1U7DVDeA5ZF-Jo9lie3FymKSSFivnpQ_Nm2CRXtBQBvy39SPGELzng0Xbh1qQ7-MGLrrVF9kMsB87uM7mtHIPQ-4ZTjITve_mE79JDZPs8EdLHT5TH8_TEEpVeQZYH8PLhlfefC7t88u5ELWTszhwD1llwP3eEiy7CdJin4oDHu7X1L9lKPy33uXjACI' // Captured moment clip
    });
    // Trigger curation scanning automatically
    triggerCurationScan();
  };

  const handlePhotoSnap = () => {
    playSound('click');
    setCapturedMedia({
      type: 'photo',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190'
    });
    triggerCurationScan();
  };

  // Simulated AI Curation scan
  const triggerCurationScan = () => {
    setIsCurationScanning(true);
    setTimeout(() => {
      setIsCurationScanning(false);
      // Give random curation grade
      const score = Math.floor(Math.random() * 15) + 82; // 82 to 96
      setCurationScore(score);
      // Determine rarity based on curation score
      if (score >= 93) setCaptureRarity('EPIC');
      else if (score >= 87) setCaptureRarity('RARE');
      else setCaptureRarity('CORE');
    }, 280000); // UI displays custom slow scanner, we can skip or show short wait
    
    // Fast mock for demo
    setTimeout(() => {
      setIsCurationScanning(false);
      const score = Math.floor(Math.random() * 15) + 82;
      setCurationScore(score);
      if (score >= 93) setCaptureRarity('EPIC');
      else if (score >= 87) setCaptureRarity('RARE');
      else setCaptureRarity('CORE');
    }, 2000);
  };

  // Simulated Social Sign-In & Smart Embedded Wallet Deployment
  const handleSocialLogin = (provider: string) => {
    initAudio();
    setIsWalletGenerating(true);
    setWalletGenStatus("Verifying OAuth credentials...");
    
    setTimeout(() => {
      setWalletGenStatus("Securing MPC key shares...");
      setTimeout(() => {
        setWalletGenStatus("Deploying gasless relayer smart contract...");
        setTimeout(() => {
          setWalletGenStatus("Wallet generated! Address: 0x71C4B...8921df4");
          setTimeout(() => {
            setIsWalletGenerating(false);
            setScreen('marketplace'); // Lead directly to the mock pages
          }, 1000);
        }, 1200);
      }, 1000);
    }, 800);
  };

  // Mock Minting NFT Transaction
  const handleMintNFT = () => {
    setIsMinting(true);
    setMintingStatus("Compressing media file...");
    
    setTimeout(() => {
      setMintingStatus("Uploading metadata to decentralised storage...");
      setTimeout(() => {
        setMintingStatus("Relaying gasless mint tx to Chiliz Chain...");
        setTimeout(() => {
          setMintingStatus("Mint confirmed! Block #1480921");
          setTimeout(() => {
            // Success! Create new moment
            const newMoment: Moment = {
              id: 'my-' + Date.now(),
              title: captureCaption || 'Starlight Equalizer',
              description: `An authentic, fan-captured live stadium moment of a match-day highlight. Category: ${captureCategory}. Minted via Matchday app with location validation.`,
              imageUrl: capturedMedia?.url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190',
              category: captureCategory,
              rarity: captureRarity,
              price: captureRarity === 'EPIC' ? 300 : captureRarity === 'RARE' ? 150 : 50,
              tokenSymbol: 'CHZ', // Mint cost CHZ
              match: 'Arsenal vs Manchester City',
              minute: "75'",
              location: 'Emirates Stadium',
              creator: {
                username: userWallet.username,
                avatar: userWallet.avatar,
                address: userWallet.address
              },
              owner: {
                username: userWallet.username,
                avatar: userWallet.avatar,
                address: userWallet.address
              },
              serial: 1,
              maxSerial: captureRarity === 'EPIC' ? 100 : captureRarity === 'RARE' ? 500 : 2500,
              timestamp: new Date().toISOString(),
              txnHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
              likes: 0,
              views: 1,
              isListed: true
            };

            // Deduct mint fee from balances (10 CHZ photo, 20 CHZ video)
            const fee = cameraMode === 'photo' ? 10 : 20;
            setUserWallet(prev => ({
              ...prev,
              chzBalance: prev.chzBalance - fee
            }));

            // Add to lists
            setMoments(prev => [newMoment, ...prev]);
            setMyCaptures(prev => [newMoment, ...prev]);
            
            playSound('success');
            setIsMinting(false);
            setCapturedMedia(null);
            setCapturedCaption('');
            setScreen('marketplace');
          }, 1200);
        }, 1500);
      }, 1000);
    }, 800);
  };

  // Mock Purchase NFT Transaction
  const handleBuyNFT = (moment: Moment) => {
    setIsBuying(true);
    setBuyStatus("Initiating secure Fan Token exchange...");
    
    setTimeout(() => {
      setBuyStatus(`Verifying allowance for ${moment.price} ${moment.tokenSymbol}...`);
      setTimeout(() => {
        setBuyStatus("Securing signature via gasless smart account relayer...");
        setTimeout(() => {
          setBuyStatus("Broadcasting order settlement to Chiliz mainnet...");
          setTimeout(() => {
            setBuyStatus("Transferring NFT and routing 10% royalty to creator...");
            setTimeout(() => {
              // Deduct balance
              const symbol = moment.tokenSymbol;
              setUserWallet(prev => {
                const balances = { ...prev.ftBalances } as any;
                if (balances[symbol] !== undefined) {
                  balances[symbol] = Math.max(0, balances[symbol] - moment.price);
                }
                return {
                  ...prev,
                  ftBalances: balances
                };
              });

              // Update Ownership on moment
              setMoments(prev => prev.map(m => {
                if (m.id === moment.id) {
                  return {
                    ...m,
                    owner: {
                      username: userWallet.username,
                      avatar: userWallet.avatar,
                      address: userWallet.address
                    },
                    isListed: false
                  };
                }
                return m;
              }));

              // Update selectedMoment state
              setSelectedMoment(prev => {
                if (!prev) return null;
                return {
                  ...prev,
                  owner: {
                    username: userWallet.username,
                    avatar: userWallet.avatar,
                    address: userWallet.address
                  },
                  isListed: false
                };
              });

              playSound('success');
              setIsBuying(false);
              setBuySuccess(true);
            }, 1000);
          }, 1200);
        }, 1000);
      }, 800);
    }, 800);
  };

  // Filter Moments based on filters and search
  const filteredMoments = moments.filter(m => {
    // Club filter
    if (selectedClubFilter !== 'ALL' && m.tokenSymbol !== selectedClubFilter) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.match.toLowerCase().includes(q) || m.location.toLowerCase().includes(q);
    }
    // Tabs filtering
    if (marketTab === 'TRENDING') {
      return m.rarity === 'EPIC' || m.rarity === 'LEGENDARY';
    }
    if (marketTab === 'LIVE') {
      return m.category === 'GOAL';
    }
    return true; // For You tab
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface font-body overflow-x-hidden relative items-center justify-center py-6 px-4 md:px-0">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-brand/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-secondary-brand/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Real-Time Push Notification Alert Banner */}
      {activeNotification && (
        <div 
          onClick={() => {
            setScreen('trending');
            setActiveNotification(null);
          }}
          className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-overlay border border-primary-brand/30 rounded-xl p-4 flex gap-3 shadow-[0_12px_40px_rgba(255,85,64,0.25)] z-[100] cursor-pointer slide-in-down select-none"
        >
          <div className="w-10 h-10 rounded-full bg-primary-brand/20 flex items-center justify-center text-primary-brand border border-primary-brand/30 flex-shrink-0 animate-bounce">
            <span className="material-symbols-outlined text-xl">{activeNotification.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-label-md font-bold text-white leading-tight font-display tracking-wide uppercase">{activeNotification.title}</h4>
            <p className="text-label-sm text-tertiary mt-0.5 leading-snug line-clamp-2">{activeNotification.body}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveNotification(null);
            }}
            className="text-tertiary hover:text-white p-1"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Main Container - Renders as Phone Mockup on Desktop, Clean 100% View on Mobile */}
      <div className="relative w-full max-w-[412px] h-[892px] md:h-[880px] bg-[#0B0E11] md:rounded-[48px] md:border-[10px] md:border-[#1F2327] overflow-hidden flex flex-col z-10 shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_0_2px_rgba(255,255,255,0.05)]">
        
        {/* Phone Notch & Status Bar (Hidden on Mobile viewports when standalone but excellent detail for demo) */}
        <div className="hidden md:flex justify-between items-center px-8 pt-4 pb-2 bg-[#0B0E11] text-xs font-semibold text-tertiary select-none z-[60]">
          <span>14:46</span>
          <div className="w-24 h-5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-3 shadow-[inset_0_0_4px_rgba(255,255,255,0.2)]"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-xs">wifi</span>
            <span className="material-symbols-outlined text-xs">battery_5_bar</span>
          </div>
        </div>

        {/* ----------------- SCREEN: ONBOARDING ----------------- */}
        {screen === 'onboarding' && (
          <div className="flex-1 flex flex-col p-6 relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-brand/10 via-transparent to-transparent"></div>
            
            {/* Header logo */}
            <div className="flex justify-center mt-8 mb-4">
              <span className="text-[28px] font-display font-black tracking-tighter text-primary-brand uppercase text-glow-primary">MATCHDAY</span>
            </div>

            {onboardingStep === 0 && (
              <div className="flex-grow flex flex-col justify-between py-6">
                {/* Image carousel / illustrations mockup */}
                <div className="relative w-full aspect-square flex items-center justify-center mt-2">
                  <div className="absolute w-[80%] h-[80%] bg-primary-brand/10 rounded-full blur-2xl animate-pulse"></div>
                  
                  {/* Slider slides */}
                  <div className="relative z-10 w-full flex flex-col items-center text-center transition-all fade-in">
                    {onboardingStep === 0 && (
                      <>
                        <div className="w-48 h-48 rounded-[24px] overflow-hidden border border-white/10 shadow-2xl relative mb-6">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190"
                            alt="Stadium Live match"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                          <span className="absolute bottom-3 left-3 bg-secondary-brand/10 border border-secondary-brand/30 px-2 py-0.5 rounded text-[10px] text-secondary-brand font-mono font-bold tracking-widest uppercase">Verified Seat</span>
                        </div>
                        <h2 className="text-headline-md font-display font-extrabold text-white leading-tight uppercase px-4">Live the dream, trade the moment</h2>
                        <p className="text-body-md text-tertiary mt-3 px-6 leading-relaxed">
                          Physically at the game? Capture epic stadium moments, mint them on-chain instantly, and trade with fellow fans.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Social logins */}
                <div className="flex flex-col gap-3 mt-4 relative z-20">
                  <p className="text-label-sm text-tertiary text-center uppercase tracking-widest font-semibold mb-1">Create Embedded Wallet</p>
                  
                  <button 
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full h-13 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center gap-3 font-semibold transition-transform active:scale-98 shadow-md cursor-pointer"
                  >
                    {/* Google SVG Icon */}
                    <svg className="w-5 h-5 pointer-events-none" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.51 15.01 0 12 0 7.35 0 3.39 2.67 1.5 6.56l3.86 3C6.28 6.94 8.91 5.04 12 5.04z"/>
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.01 3.67-8.64z"/>
                      <path fill="#FBBC05" d="M5.36 14.44c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3L1.5 6.84C.54 8.77 0 10.92 0 13.2s.54 4.43 1.5 6.36l3.86-3.12z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.09 0-5.72-1.9-6.66-4.52l-3.86 3.12C3.39 21.33 7.35 24 12 24z"/>
                    </svg>
                    <span className="pointer-events-none">Continue with Google</span>
                  </button>
                  <button 
                    onClick={() => handleSocialLogin('Email')}
                    className="w-full h-13 rounded-full bg-surface-container border border-white/10 text-white flex items-center justify-center gap-3 font-semibold transition-transform active:scale-98 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg pointer-events-none">mail</span>
                    <span className="pointer-events-none">Sign in with Email</span>
                  </button>
                  
                  <div className="flex justify-between items-center px-4 mt-2">
                    <span className="text-[11px] text-tertiary font-mono">By signing up you agree to Terms</span>
                    <button className="text-[11px] text-primary-brand font-bold uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer">
                      Socios Link <span className="material-symbols-outlined text-[10px] pointer-events-none">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {onboardingStep === 1 && (
              <div className="flex-grow flex flex-col justify-between py-6 transition-all fade-in">
                <div className="flex flex-col items-center text-center mt-6">
                  <div className="w-16 h-16 rounded-full bg-secondary-brand/10 border border-secondary-brand/30 flex items-center justify-center text-secondary-brand shadow-[0_0_20px_rgba(0,238,252,0.15)] mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-3xl">security</span>
                  </div>
                  <h2 className="text-headline-md font-display font-extrabold text-white leading-tight uppercase px-4">Verification Setup</h2>
                  <p className="text-body-md text-tertiary mt-3 px-6 leading-relaxed">
                    To guarantee only genuine supporters at the stadium can mint moments, verify your location and camera access.
                  </p>
                </div>

                {/* Permission Cards */}
                <div className="flex flex-col gap-4 px-2 my-auto">
                  {/* Location Card */}
                  <div className="glass-panel rounded-2xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${locationPermission === 'granted' ? 'bg-green-500/20 text-green-400' : 'bg-surface-container text-tertiary'}`}>
                        <span className="material-symbols-outlined text-xl">location_on</span>
                      </div>
                      <div>
                        <h4 className="text-label-md font-bold text-white uppercase tracking-wider">Location verification</h4>
                        <p className="text-label-sm text-tertiary">Confirm you are inside stadium geo-fence</p>
                      </div>
                    </div>
                    {locationPermission === 'granted' ? (
                      <span className="material-symbols-outlined text-green-400 font-bold">check_circle</span>
                    ) : (
                      <button 
                        onClick={requestLocation}
                        className="px-4 py-1.5 rounded-full bg-secondary-brand text-black text-label-sm font-bold active:scale-95 transition-transform"
                      >
                        Grant
                      </button>
                    )}
                  </div>

                  {/* Camera Card */}
                  <div className="glass-panel rounded-2xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cameraPermission === 'granted' ? 'bg-green-500/20 text-green-400' : 'bg-surface-container text-tertiary'}`}>
                        <span className="material-symbols-outlined text-xl">photo_camera</span>
                      </div>
                      <div>
                        <h4 className="text-label-md font-bold text-white uppercase tracking-wider">Camera Permissions</h4>
                        <p className="text-label-sm text-tertiary">Needed to capture live match snaps</p>
                      </div>
                    </div>
                    {cameraPermission === 'granted' ? (
                      <span className="material-symbols-outlined text-green-400 font-bold">check_circle</span>
                    ) : (
                      <button 
                        onClick={requestCamera}
                        className="px-4 py-1.5 rounded-full bg-secondary-brand text-black text-label-sm font-bold active:scale-95 transition-transform"
                      >
                        Grant
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setScreen('marketplace');
                      // If they granted camera, start loading it in background
                      if (cameraPermission === 'granted') {
                        requestCamera();
                      }
                    }}
                    className="w-full h-13 rounded-full bg-primary-brand text-white font-bold uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all"
                  >
                    Enter Matchday
                  </button>
                  <button 
                    onClick={() => setScreen('marketplace')}
                    className="text-label-sm text-tertiary hover:text-white uppercase tracking-widest text-center py-2"
                  >
                    Skip Setup for now
                  </button>
                </div>
              </div>
            )}

            {/* Smart account MPC creation loading screen overlay */}
            {isWalletGenerating && (
              <div className="absolute inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="relative w-16 h-16 mb-6">
                  {/* Glowing spinner ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-primary-brand/20 border-t-primary-brand animate-spin"></div>
                  <div className="absolute inset-1.5 rounded-full border-4 border-secondary-brand/10 border-t-secondary-brand animate-spin duration-700"></div>
                </div>
                <h3 className="text-headline-md font-display font-extrabold text-white uppercase tracking-wider">Deploying Embedded Wallet</h3>
                <p className="text-label-md text-secondary-brand font-mono mt-3 animate-pulse">{walletGenStatus}</p>
                <p className="text-label-sm text-tertiary mt-12 max-w-xs leading-relaxed">
                  We create an on-chain smart account behind the scenes using your social login. Gas fees, key custody, and relayer complexities are completely hidden.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ----------------- APP SHELL (Renders Header + Main scroll area + Bottom Nav) ----------------- */}
        {screen !== 'onboarding' && (
          <>
            {/* Header (TopAppBar) */}
            <header className="flex justify-between items-center px-4 h-16 bg-surface/85 backdrop-blur-xl border-b border-white/10 shadow-md select-none z-40 relative">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setPreviousScreen(screen as any);
                    setScreen('profile');
                  }}
                  className="w-9 h-9 rounded-full overflow-hidden border border-white/20 active:scale-95 transition-transform"
                >
                  <img 
                    src={userWallet.avatar}
                    alt="User Profile" 
                    className="w-full h-full object-cover"
                  />
                </button>
                <div 
                  onClick={() => setScreen('marketplace')}
                  className="text-xl font-display font-black tracking-tighter text-primary-brand uppercase text-glow-primary cursor-pointer"
                >
                  MATCHDAY
                </div>
              </div>

              {/* Wallet Info Display */}
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => {
                    setPreviousScreen(screen as any);
                    setScreen('profile');
                  }}
                  className="flex items-center gap-1.5 bg-surface-container border border-white/5 rounded-full py-1.5 px-3 cursor-pointer hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-secondary-brand">token</span>
                  <span className="text-[12px] font-mono font-bold text-white leading-none">{userWallet.ftBalances.BAR} BAR</span>
                </div>
                <button 
                  onClick={() => {
                    setPreviousScreen(screen as any);
                    setScreen('trending');
                  }}
                  className="w-9 h-9 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-primary hover:bg-surface-container-high active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
                </button>
              </div>
            </header>

            {/* Scrollable Screen Content Canvas */}
            <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex flex-col bg-background">
              
              {/* ----------------- SCREEN: MARKETPLACE ----------------- */}
              {screen === 'marketplace' && (
                <div className="p-4 flex flex-col gap-4 animate-fade">
                  
                  {/* Search and Filters */}
                  <div className="flex gap-2 w-full">
                    <div className="flex-1 bg-surface-container border border-white/10 rounded-full h-11 flex items-center px-4 gap-2.5 focus-within:border-secondary-brand/50 transition-colors">
                      <span className="material-symbols-outlined text-tertiary text-lg">search</span>
                      <input 
                        type="text" 
                        placeholder="Search moments, matches..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-tertiary border-none outline-none w-full"
                      />
                    </div>
                  </div>

                  {/* Club Filter Chips */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1 select-none">
                    {['ALL', 'BAR', 'PSG', 'ACM', 'CITY'].map(club => (
                      <button
                        key={club}
                        onClick={() => setSelectedClubFilter(club)}
                        className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                          selectedClubFilter === club
                            ? 'bg-secondary-brand/10 border-secondary-brand text-secondary-brand shadow-[0_0_10px_rgba(0,238,252,0.15)]'
                            : 'bg-surface-container border-white/10 text-tertiary hover:border-white/30'
                        }`}
                      >
                        {club === 'ALL' ? 'All Clubs' : club}
                      </button>
                    ))}
                  </div>

                  {/* Marketplace Tabs */}
                  <div className="flex border-b border-white/10 pb-1 mt-1">
                    {(['FOR_YOU', 'TRENDING', 'LIVE'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setMarketTab(tab)}
                        className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest text-center transition-colors relative ${
                          marketTab === tab ? 'text-primary' : 'text-tertiary hover:text-white'
                        }`}
                      >
                        {tab.replace('_', ' ')}
                        {marketTab === tab && (
                          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full"></div>
                        )}
                        {tab === 'LIVE' && (
                          <span className="w-1.5 h-1.5 bg-primary-brand rounded-full absolute top-0 right-8 animate-ping"></span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Grid Moments Feed */}
                  <div className="grid grid-cols-2 gap-3 pb-8">
                    {filteredMoments.length > 0 ? (
                      filteredMoments.map(moment => (
                        <article 
                          key={moment.id}
                          onClick={() => {
                            setSelectedMoment(moment);
                            setPreviousScreen('marketplace');
                            setScreen('detail');
                          }}
                          className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 bg-[#161B22] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-end"
                        >
                          {/* Image card */}
                          <img 
                            src={moment.imageUrl} 
                            alt={moment.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Bottom Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10"></div>
                          
                          {/* Card Rarity and Token Chips */}
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start z-20">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-black/60 backdrop-blur-md border ${
                              moment.rarity === 'LEGENDARY' ? 'border-amber-400 text-amber-400' :
                              moment.rarity === 'EPIC' ? 'border-primary-brand text-primary-brand' :
                              moment.rarity === 'RARE' ? 'border-secondary-brand text-secondary-brand' : 'border-white/20 text-white'
                            }`}>
                              {moment.rarity}
                            </span>
                            <span className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[13px] text-white">favorite</span>
                            </span>
                          </div>

                          {/* Info area */}
                          <div className="p-3 flex flex-col gap-0.5 z-20 relative">
                            <div className="flex items-center gap-1 text-[10px] text-tertiary font-medium">
                              <span className="material-symbols-outlined text-[11px]">location_on</span>
                              <span className="truncate">{moment.location}, {moment.minute}</span>
                            </div>
                            <h3 className="text-sm font-display font-extrabold text-white line-clamp-1 leading-tight uppercase">{moment.title}</h3>
                            
                            <div className="flex items-center justify-between mt-1.5 pt-2 border-t border-white/10">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[13px] text-secondary-brand">token</span>
                                <span className="text-xs font-mono font-bold text-white">{moment.price} {moment.tokenSymbol}</span>
                              </div>
                              <span className="text-[9px] font-mono text-tertiary">#{moment.serial.toString().padStart(4, '0')}</span>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-16 flex flex-col items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-tertiary">search_off</span>
                        <p className="text-sm text-tertiary font-semibold uppercase tracking-wider">No moments found</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ----------------- SCREEN: TRENDING ----------------- */}
              {screen === 'trending' && (
                <div className="p-4 flex flex-col gap-5 animate-fade">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-primary-brand">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                      <h2 className="text-headline-md font-display font-extrabold uppercase tracking-wide">WHAT'S HOT</h2>
                    </div>
                    <p className="text-label-sm text-tertiary">Real-time stadium activity and spiking moments.</p>
                  </div>

                  {/* Section: Live Hot Matches */}
                  <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-tertiary uppercase tracking-widest">Live Hot Matches</h3>
                      <span className="w-2 h-2 rounded-full bg-primary-brand animate-pulse"></span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                      {MOCK_MATCHES.map(match => (
                        <div 
                          key={match.id}
                          className="flex-none w-[280px] glass-container rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden group select-none cursor-pointer"
                          onClick={() => {
                            setSuggestedCheckIn(`${match.location} (${match.teamHomeSymbol} vs ${match.teamAwaySymbol})`);
                            setScreen('snap');
                          }}
                        >
                          {/* Top hot progress bar indicator */}
                          <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5">
                            <div className="h-full bg-primary-brand rounded-r-full shadow-[0_0_8px_rgba(255,85,64,0.6)]" style={{ width: match.id === 'm1' ? '85%' : match.id === 'm2' ? '45%' : '65%' }}></div>
                          </div>

                          <div className="flex justify-between items-center mt-1">
                            <span className="flex items-center gap-1 bg-surface-container-high border border-white/5 px-2 py-0.5 rounded text-[10px] font-bold text-primary-brand">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-brand animate-ping"></span>
                              {match.time} LIVE
                            </span>
                            <span className="text-[10px] font-bold text-secondary-brand flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">photo_camera</span>
                              {(match.activeCapturers/1000).toFixed(1)}k Snapping
                            </span>
                          </div>

                          {/* Scores block */}
                          <div className="flex justify-between items-center py-2 px-1">
                            <div className="flex flex-col items-center gap-1 w-16">
                              <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center overflow-hidden">
                                <img src={match.teamHomeLogo} alt={match.teamHome} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[11px] font-bold text-white font-mono uppercase tracking-wider">{match.teamHomeSymbol}</span>
                            </div>

                            <div className="text-xl font-display font-extrabold text-white flex items-center gap-3">
                              <span>{match.scoreHome}</span>
                              <span className="text-tertiary/40 font-normal text-sm">-</span>
                              <span>{match.scoreAway}</span>
                            </div>

                            <div className="flex flex-col items-center gap-1 w-16">
                              <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center overflow-hidden">
                                <img src={match.teamAwayLogo} alt={match.teamAway} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[11px] font-bold text-white font-mono uppercase tracking-wider">{match.teamAwaySymbol}</span>
                            </div>
                          </div>

                          <div className="text-[10px] font-medium text-tertiary flex items-center gap-1 bg-white/5 py-1 px-2.5 rounded-full">
                            <span className="material-symbols-outlined text-xs text-secondary-brand">location_on</span>
                            <span className="truncate">{match.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section: Bento grid Spiking Moments */}
                  <section className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-tertiary uppercase tracking-widest">Trending Spikers</h3>
                      <button className="text-xs text-secondary-brand font-bold uppercase tracking-wider hover:underline">View All</button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Hero spike card */}
                      <div 
                        onClick={() => {
                          setSelectedMoment(moments[0]);
                          setPreviousScreen('trending');
                          setScreen('detail');
                        }}
                        className="col-span-2 h-44 rounded-2xl overflow-hidden border border-white/10 relative group cursor-pointer flex flex-col justify-end p-4"
                      >
                        <img src={moments[0].imageUrl} alt="Spiker Hero" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                        
                        <span className="absolute top-3 right-3 bg-primary-brand/20 border border-primary-brand/40 px-2 py-0.5 rounded text-[9px] font-bold text-primary-brand uppercase tracking-wider">Epic</span>
                        
                        <div className="relative z-10 flex justify-between items-end">
                          <div>
                            <h4 className="text-sm font-display font-black text-white uppercase tracking-wide">{moments[0].title}</h4>
                            <p className="text-[11px] text-tertiary font-medium">{moments[0].match} • {moments[0].minute}</p>
                          </div>
                          <div className="flex flex-col items-end text-right">
                            <span className="text-xs font-mono font-bold text-green-400">+24%</span>
                            <span className="text-xs font-mono font-bold text-white">{moments[0].price} {moments[0].tokenSymbol}</span>
                          </div>
                        </div>
                      </div>

                      {/* Small spikes */}
                      {moments.slice(1, 3).map((moment, idx) => (
                        <div 
                          key={moment.id}
                          onClick={() => {
                            setSelectedMoment(moment);
                            setPreviousScreen('trending');
                            setScreen('detail');
                          }}
                          className="h-36 rounded-2xl overflow-hidden border border-white/10 relative group cursor-pointer flex flex-col justify-end p-3"
                        >
                          <img src={moment.imageUrl} alt={moment.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                          
                          <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-black/60 border ${moment.rarity === 'LEGENDARY' ? 'border-amber-400 text-amber-400' : 'border-secondary-brand text-secondary-brand'}`}>
                            {moment.rarity}
                          </span>

                          <div className="relative z-10 flex flex-col gap-0.5">
                            <h4 className="text-[12px] font-display font-extrabold text-white uppercase tracking-wide line-clamp-1">{moment.title}</h4>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[9px] font-mono text-tertiary">#{moment.serial.toString().padStart(4, '0')}</span>
                              <span className="text-[11px] font-mono font-bold text-green-400">+{idx === 0 ? '12%' : '8%'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section: Leaderboard / Curation rewards */}
                  <section className="glass-panel rounded-2xl p-4 flex flex-col gap-3 mb-6">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-secondary-brand">military_tech</span>
                      Top Capturers Leaderboard
                    </h3>
                    <div className="flex flex-col gap-2.5 pt-1">
                      <div className="flex items-center justify-between text-sm py-1 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-tertiary font-bold w-4">1</span>
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoQWEv1JjL9GDnCFZ_UsPpfINKPwPcDsH5iDRpzlbE6e92Z9MWbMHbKEz9UHheiojwvVcUkc45RQd-5uCJqgM_7SvYl3So5VnkiyTVKWSWQqMCRT0P4t1Pf0RL7T3jb4y4JbB7bAk7uvQryan0hxc3rqu6NZTVHHEF5A29jRptqFdLMpBLOBwzG_7DHmAW7jNhy7Aq05b3QAstPDUc4-KfTgfEDZvXL6gOqQCwQS8r40sFBUWrqnfjHOrK8WOhQFCQYfRU8dgh-Aw" className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-white font-bold font-mono text-[12px]">@UltrasParis99</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-secondary-brand">2,450 CHZ</span>
                      </div>
                      <div className="flex items-center justify-between text-sm py-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-primary-brand font-bold w-4">2</span>
                          <img src={userWallet.avatar} className="w-6 h-6 rounded-full object-cover border border-primary-brand/30" />
                          <span className="text-white font-bold font-mono text-[12px]">@StadiumKing (You)</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-secondary-brand">1,250 BAR</span>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* ----------------- SCREEN: SNAP (THE CORE EXPERIENCES) ----------------- */}
              {screen === 'snap' && (
                <div className="flex-1 flex flex-col relative overflow-hidden bg-black h-full">
                  
                  {/* Camera view finder */}
                  <div className="absolute inset-0 w-full h-full z-0 bg-surface-container-lowest">
                    {cameraPermission === 'granted' ? (
                      <video 
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover opacity-90"
                      />
                    ) : (
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp67mGs7ImnLNJD0V0Ci05zU2cTmKt2NfS7-7udAD1i5tO3WjJ-mWTDNbsvMKXWCpoFUUw0F6_aLSiAbub-95mqjr8lzJJXsofsEprLtF3_zibHLYJJ8Z2yZrOk3rAXMF7-b672eJkEtXVtoFIPFXYJ_1FMR5n_Z4aO2q_QpDqbz_nRC-3VM6iPK7j6N5qIbHEdzOVFbGo9PuB2_Ud2xsmM4Pkq2bGp43XOQhxqMQxqBw2cws8XoDL30LfwlSfor33gxLLhszE190"
                        alt="Simulated stadium camera viewfinder background"
                        className="w-full h-full object-cover opacity-75"
                      />
                    )}
                    {/* Simulated digital scanner grid overlay when recording */}
                    {isRecording && <div className="absolute inset-0 scanline pointer-events-none z-10"></div>}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-10 pointer-events-none"></div>
                  </div>

                  {/* Top Camera Controls Overlay */}
                  <header className="relative z-20 w-full pt-4 px-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center w-full">
                      <button 
                        onClick={() => setScreen('marketplace')}
                        className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsFlashOn(!isFlashOn)}
                          className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-90 transition-transform ${isFlashOn ? 'bg-amber-400 text-black' : 'bg-black/40 text-white'}`}
                        >
                          <span className="material-symbols-outlined text-lg">{isFlashOn ? 'flash_on' : 'flash_off'}</span>
                        </button>
                        <button 
                          onClick={requestCamera}
                          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
                        >
                          <span className="material-symbols-outlined text-lg">cameraswitch</span>
                        </button>
                      </div>
                    </div>

                    {/* Geolocation check-in badge */}
                    <div className="flex justify-center w-full">
                      <div className="bg-[#1D2023]/70 backdrop-blur-md border border-secondary-brand/30 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-[0_4px_16px_rgba(0,238,252,0.15)] select-none">
                        <div className="relative flex items-center justify-center w-2 h-2">
                          <div className="absolute w-full h-full bg-secondary-brand rounded-full animate-ping opacity-75"></div>
                          <div className="relative w-2 h-2 rounded-full bg-secondary-brand"></div>
                        </div>
                        <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Geo-CheckIn</span>
                        <span className="text-xs font-semibold text-white truncate max-w-[180px]">{suggestedCheckIn}</span>
                      </div>
                    </div>

                    {/* Active Live Recording Countdown timer */}
                    {isRecording && (
                      <div className="flex justify-center w-full mt-1">
                        <div className="bg-primary-brand/20 border border-primary-brand/50 backdrop-blur-md rounded-md px-3 py-1 flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary-brand animate-pulse"></div>
                          <span className="text-xs font-mono font-bold text-primary tracking-widest">00:{recordingSeconds.toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                    )}
                  </header>

                  {/* Bottom Controls Overlay */}
                  <footer className="relative z-20 w-full pb-8 px-4 flex flex-col gap-5 mt-auto select-none">
                    
                    {/* Toggle photo/video mode */}
                    <div className="flex justify-center gap-6 text-xs font-bold w-full">
                      <button 
                        onClick={() => {
                          if (isRecording) return;
                          setCameraMode('photo');
                        }}
                        className={`transition-colors py-1 ${cameraMode === 'photo' ? 'text-secondary-brand border-b-2 border-secondary-brand font-black' : 'text-tertiary hover:text-white'}`}
                      >
                        PHOTO
                      </button>
                      <button 
                        onClick={() => {
                          if (isRecording) return;
                          setCameraMode('video');
                        }}
                        className={`transition-colors py-1 ${cameraMode === 'video' ? 'text-primary-brand border-b-2 border-primary-brand font-black' : 'text-tertiary hover:text-white'}`}
                      >
                        VIDEO
                      </button>
                    </div>

                    {/* Suggested capture metadata tag scroll */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar w-full py-0.5">
                      {['Goal', 'Celebration', 'Save', 'Crowd', 'Tension'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setActiveCaptureTag(tag)}
                          className={`shrink-0 px-3.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            activeCaptureTag === tag
                              ? 'border-secondary-brand bg-secondary-brand/10 text-secondary-brand'
                              : 'border-white/10 bg-black/45 text-tertiary hover:text-white'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Capturer Actions Shutter block */}
                    <div className="flex justify-between items-center w-full mt-1 px-4">
                      {/* Simulated Gallery preview block */}
                      <button 
                        onClick={() => {
                          setScreen('profile');
                          setProfileTab('CAPTURES');
                        }}
                        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white overflow-hidden active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-xl">photo_library</span>
                      </button>

                      {/* Primary Camera Button Shutter */}
                      <div className="flex flex-col items-center gap-2">
                        {cameraMode === 'video' ? (
                          <button 
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            className="relative w-20 h-20 rounded-full border-[3px] border-white/50 flex items-center justify-center p-1 active:scale-95 transition-transform duration-150"
                          >
                            <div className="absolute inset-[-6px] rounded-full border border-primary-brand/30 recording-pulse pointer-events-none"></div>
                            <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-[#ff5540]' : 'bg-primary-brand'}`}>
                              {isRecording ? (
                                <div className="w-5 h-5 rounded-[4px] bg-white transition-all duration-300"></div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-white transition-all duration-300"></div>
                              )}
                            </div>
                          </button>
                        ) : (
                          <button 
                            onClick={handlePhotoSnap}
                            className="relative w-20 h-20 rounded-full border-[3px] border-white/50 flex items-center justify-center p-1 active:scale-95 transition-transform duration-150"
                          >
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/15"></div>
                          </button>
                        )}
                        <span className="text-[10px] font-mono text-tertiary bg-black/50 px-2 py-0.5 rounded-full border border-white/5 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]">token</span>
                          {cameraMode === 'photo' ? '10 CHZ to Mint' : '20 CHZ to Mint'}
                        </span>
                      </div>

                      {/* Flip Camera */}
                      <button 
                        onClick={requestCamera}
                        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-xl">cameraswitch</span>
                      </button>
                    </div>
                  </footer>

                  {/* Captured Media Preview & Minting overlay modal */}
                  {capturedMedia && (
                    <div className="absolute inset-0 bg-[#0B0E11] z-50 flex flex-col p-4 overflow-y-auto no-scrollbar">
                      
                      {/* Header back */}
                      <div className="flex items-center gap-2 mb-3">
                        <button 
                          onClick={() => {
                            setCapturedMedia(null);
                            setCurationScore(null);
                          }}
                          className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
                        >
                          <span className="material-symbols-outlined text-lg">arrow_back</span>
                        </button>
                        <span className="text-label-md font-bold uppercase tracking-wider text-white">Preview & Curation check</span>
                      </div>

                      {/* Captured Image display */}
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black flex-shrink-0">
                        <img src={capturedMedia.url} alt="Captured preview" className="w-full h-full object-cover" />
                        
                        {/* Scanline overlay for curation check */}
                        {isCurationScanning && (
                          <>
                            <div className="absolute inset-0 scanline z-10"></div>
                            <div className="absolute inset-0 bg-black/40 z-0 flex flex-col items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-3xl text-secondary-brand animate-spin">cyclone</span>
                              <span className="text-xs font-mono font-bold text-secondary-brand animate-pulse uppercase tracking-wider">AI Quality scanning...</span>
                            </div>
                          </>
                        )}

                        {/* Curation score overlay */}
                        {!isCurationScanning && curationScore && (
                          <div className="absolute bottom-4 left-4 right-4 bg-[#161B22]/85 backdrop-blur-md border border-white/10 rounded-xl p-3 flex justify-between items-center z-10">
                            <div>
                              <p className="text-[10px] text-tertiary uppercase tracking-widest font-bold">AI Curation Grade</p>
                              <p className="text-lg font-display font-extrabold text-green-400 mt-0.5">{curationScore}% PASSED</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                              captureRarity === 'EPIC' ? 'border-primary-brand bg-primary-brand/10 text-primary-brand' :
                              captureRarity === 'RARE' ? 'border-secondary-brand bg-secondary-brand/10 text-secondary-brand' :
                              'border-white/20 text-white'
                            }`}>
                              {captureRarity} NFT
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Metadata Editor */}
                      <div className="flex flex-col gap-4 mt-4 mb-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-tertiary uppercase tracking-widest">Describe the Moment</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Haaland bicycle kick right in front of row 4! Equalizer!"
                            value={captureCaption}
                            onChange={(e) => setCapturedCaption(e.target.value)}
                            className="h-11 bg-surface-container border border-white/10 rounded-xl px-4 text-sm text-white focus:border-secondary-brand outline-none transition-colors"
                          />
                        </div>

                        {/* Category selection */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-tertiary uppercase tracking-widest">Collectible Category</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['GOAL', 'SAVE', 'CELEBRATION', 'CROWD', 'TENSION'].map(cat => (
                              <button
                                key={cat}
                                onClick={() => setCaptureCategory(cat as any)}
                                className={`h-9 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                  captureCategory === cat
                                    ? 'border-primary-brand bg-primary-brand/10 text-primary-brand'
                                    : 'border-white/10 bg-surface-container text-tertiary'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Mint pricing details */}
                        <div className="glass-panel rounded-2xl p-4 flex justify-between items-center text-xs mt-1">
                          <div className="flex flex-col gap-1">
                            <span className="text-tertiary uppercase tracking-widest font-bold">Upload & Mint cost</span>
                            <span className="text-sm font-bold text-white font-mono">{cameraMode === 'photo' ? '10 CHZ' : '20 CHZ'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-tertiary block font-bold uppercase tracking-widest">Available Balance</span>
                            <span className="font-mono text-secondary-brand block mt-0.5">{userWallet.chzBalance} CHZ</span>
                          </div>
                        </div>

                        {/* Submit Mint Button */}
                        <button
                          onClick={handleMintNFT}
                          disabled={isCurationScanning || isMinting}
                          className="h-13 rounded-full bg-primary-brand text-white font-bold uppercase tracking-wider shadow-lg shadow-primary-brand/20 active:scale-98 disabled:opacity-50 transition-all mt-2"
                        >
                          {isMinting ? 'Minting Moment...' : 'Mint & List collectible'}
                        </button>
                      </div>

                      {/* Minting process loader */}
                      {isMinting && (
                        <div className="absolute inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-6 text-center">
                          <div className="relative w-16 h-16 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-primary-brand/20 border-t-primary-brand animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-4 border-secondary-brand/10 border-t-secondary-brand animate-spin duration-700"></div>
                          </div>
                          <h3 className="text-headline-md font-display font-extrabold text-white uppercase tracking-wider">Minting NFT</h3>
                          <p className="text-label-md text-secondary-brand font-mono mt-3 animate-pulse">{mintingStatus}</p>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* ----------------- SCREEN: PROFILE / EARNINGS ----------------- */}
              {screen === 'profile' && (
                <div className="p-4 flex flex-col gap-5 animate-fade">
                  
                  {/* Header profile back icon */}
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setScreen(previousScreen)}
                      className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </button>
                    <span className="text-label-md font-bold uppercase tracking-widest text-white">Owner Hub</span>
                    <button 
                      onClick={() => playSound('click')}
                      className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-lg">settings</span>
                    </button>
                  </div>

                  {/* Profile metadata block */}
                  <section className="flex flex-col items-center relative mt-2">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-brand/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <div className="relative w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-primary-brand to-secondary-brand mb-3 shadow-lg shadow-primary-brand/15">
                      <img src={userWallet.avatar} alt="Profile photo" className="w-full h-full rounded-full object-cover border-4 border-background" />
                    </div>
                    <h2 className="text-lg font-display font-extrabold text-white uppercase">@{userWallet.username}</h2>
                    <div className="mt-1.5 flex items-center gap-1.5 bg-secondary-brand/10 border border-secondary-brand/20 px-3 py-1 rounded-full">
                      <span className="material-symbols-outlined text-secondary-brand text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <span className="text-[10px] font-bold text-secondary-brand uppercase tracking-widest">Pro Capturer</span>
                    </div>
                  </section>

                  {/* Dashboard Earnings balance card */}
                  <section className="glass-panel rounded-3xl p-5 relative overflow-hidden shadow-xl mt-1">
                    <div className="absolute -right-10 -top-10 w-36 h-36 bg-secondary-brand/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Total Capturer Income</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <h3 className="text-3xl font-display font-black text-primary leading-none">1,250</h3>
                          <span className="text-xs font-bold text-white">BAR</span>
                        </div>
                        <p className="text-[10px] text-tertiary font-mono mt-1">≈ $4,500.00 USD</p>
                      </div>
                      <div className="bg-surface-container p-2.5 rounded-full border border-white/5 text-primary-brand">
                        <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                      </div>
                    </div>

                    {/* SVG Sparkline chart */}
                    <div className="h-10 w-full mb-4 mt-2">
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                        <defs>
                          <linearGradient id="chartGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="#ffb4a8" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#ffb4a8" stopOpacity="1" />
                            <stop offset="100%" stopColor="#00eefc" stopOpacity="1" />
                          </linearGradient>
                          <linearGradient id="fillGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffb4a8" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#ffb4a8" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,25 Q10,18 20,20 T40,12 T60,15 T80,5 T100,2" fill="none" stroke="url(#chartGrad)" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M0,25 Q10,18 20,20 T40,12 T60,15 T80,5 T100,2 L100,30 L0,30 Z" fill="url(#fillGrad)" />
                      </svg>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
                      <div>
                        <p className="text-tertiary uppercase tracking-widest font-bold">Moments Sold</p>
                        <p className="text-base font-extrabold text-white font-mono mt-0.5">42</p>
                      </div>
                      <div>
                        <p className="text-tertiary uppercase tracking-widest font-bold">Royalty Income</p>
                        <p className="text-base font-extrabold text-secondary-brand font-mono mt-0.5">150 BAR</p>
                      </div>
                    </div>
                  </section>

                  {/* Profile Tabs */}
                  <div className="flex border-b border-white/10 mt-1 select-none">
                    <button
                      onClick={() => setProfileTab('CAPTURES')}
                      className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest text-center transition-colors relative ${
                        profileTab === 'CAPTURES' ? 'text-primary' : 'text-tertiary hover:text-white'
                      }`}
                    >
                      My Captures ({myCaptures.length})
                      {profileTab === 'CAPTURES' && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setProfileTab('COLLECTION')}
                      className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest text-center transition-colors relative ${
                        profileTab === 'COLLECTION' ? 'text-primary' : 'text-tertiary hover:text-white'
                      }`}
                    >
                      My Collection ({moments.filter(m => m.owner.username === userWallet.username && m.creator.username !== userWallet.username).length})
                      {profileTab === 'COLLECTION' && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full"></div>
                      )}
                    </button>
                  </div>

                  {/* Profile Captures/Collection items list */}
                  <div className="grid grid-cols-2 gap-3 pb-8">
                    {profileTab === 'CAPTURES' ? (
                      <>
                        {/* Captures */}
                        {myCaptures.map(moment => (
                          <div 
                            key={moment.id}
                            onClick={() => {
                              setSelectedMoment(moment);
                              setPreviousScreen('profile');
                              setScreen('detail');
                            }}
                            className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 bg-[#161B22] flex flex-col justify-end"
                          >
                            <img src={moment.imageUrl} alt={moment.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                            
                            <div className="absolute top-2 left-2 right-2 flex justify-between z-20">
                              <span className="bg-secondary-brand/10 border border-secondary-brand/30 px-2 py-0.5 rounded text-[8px] font-bold text-secondary-brand uppercase tracking-wider">
                                {moment.isListed ? 'Listed' : 'Minted'}
                              </span>
                            </div>

                            <div className="p-3 relative z-10">
                              <p className="text-[9px] font-mono text-tertiary uppercase">#{moment.serial.toString().padStart(4, '0')}</p>
                              <h4 className="text-xs font-display font-extrabold text-white uppercase tracking-wide line-clamp-1 leading-tight">{moment.title}</h4>
                            </div>
                          </div>
                        ))}

                        {/* CTA shortcut to Snap camera */}
                        <div 
                          onClick={() => setScreen('snap')}
                          className="relative aspect-[3/4] rounded-2xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2.5 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-brand border border-white/5 shadow-md">
                            <span className="material-symbols-outlined text-lg">add</span>
                          </div>
                          <span className="text-[11px] font-bold uppercase text-tertiary tracking-wider">Snap New Moment</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Collection */}
                        {moments.filter(m => m.owner.username === userWallet.username && m.creator.username !== userWallet.username).length > 0 ? (
                          moments.filter(m => m.owner.username === userWallet.username && m.creator.username !== userWallet.username).map(moment => (
                            <div 
                              key={moment.id}
                              onClick={() => {
                                setSelectedMoment(moment);
                                setPreviousScreen('profile');
                                setScreen('detail');
                              }}
                              className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 bg-[#161B22] flex flex-col justify-end"
                            >
                              <img src={moment.imageUrl} alt={moment.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                              
                              <div className="absolute top-2 left-2 right-2 flex justify-between z-20">
                                <span className="bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded text-[8px] font-bold text-amber-400 uppercase tracking-wider">
                                  Collected
                                </span>
                              </div>

                              <div className="p-3 relative z-10">
                                <p className="text-[9px] font-mono text-tertiary uppercase">#{moment.serial.toString().padStart(4, '0')}</p>
                                <h4 className="text-xs font-display font-extrabold text-white uppercase tracking-wide line-clamp-1 leading-tight">{moment.title}</h4>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-16 flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-3xl text-tertiary">category</span>
                            <p className="text-xs text-tertiary font-bold uppercase tracking-widest leading-relaxed">No collected moments yet.<br/>Buy them on the Marketplace.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ----------------- SCREEN: DETAIL VIEW ----------------- */}
              {screen === 'detail' && selectedMoment && (
                <div className="flex flex-col relative animate-fade">
                  
                  {/* Hero Media header */}
                  <div className="relative w-full aspect-[4/5] bg-surface-container-lowest overflow-hidden flex-shrink-0">
                    <img 
                      src={selectedMoment.imageUrl} 
                      alt={selectedMoment.title} 
                      className="w-full h-full object-cover filter brightness-90"
                    />

                    {/* Top actions */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                      <button 
                        onClick={() => {
                          setScreen(previousScreen);
                          setBuySuccess(false);
                        }}
                        className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                      </button>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => playSound('click')}
                          className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
                        >
                          <span className="material-symbols-outlined text-lg">share</span>
                        </button>
                      </div>
                    </div>

                    {/* Simulated video playback controls */}
                    <div className="absolute inset-0 flex items-center justify-center z-15">
                      <button 
                        onClick={() => playSound('click')}
                        className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      </button>
                    </div>

                    {/* Bottom gradient and quick metadata tags */}
                    <div className="absolute bottom-0 w-full h-2/5 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/75 to-transparent flex flex-col justify-end p-4 pb-6 z-10">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded border border-white/15 text-[9px] font-extrabold uppercase tracking-widest text-secondary-brand bg-black/60 backdrop-blur-sm">
                          {selectedMoment.rarity}
                        </span>
                        <span className="px-2 py-0.5 rounded border border-white/15 text-[9px] font-extrabold uppercase tracking-widest text-white bg-black/60 backdrop-blur-sm">
                          {selectedMoment.category}
                        </span>
                      </div>
                      <h2 className="text-xl font-display font-black text-white leading-tight uppercase">{selectedMoment.title}</h2>
                      <p className="text-xs font-medium text-tertiary mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-primary-brand">sports_soccer</span>
                        {selectedMoment.match} • {selectedMoment.minute}
                      </p>
                    </div>
                  </div>

                  {/* Scrollable details canvas */}
                  <div className="p-4 flex flex-col gap-5 pb-32">
                    
                    {/* Provenance Glass Panel */}
                    <div className="glass-panel rounded-2xl p-4 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-brand/10 border border-secondary-brand/30 flex items-center justify-center text-secondary-brand shadow-[0_0_12px_rgba(0,238,252,0.1)]">
                          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <div>
                          <p className="text-tertiary uppercase tracking-widest font-bold">Serial Scarcity</p>
                          <p className="text-sm font-bold text-white mt-0.5 text-glow-secondary font-mono">#{selectedMoment.serial} / {selectedMoment.maxSerial}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-tertiary uppercase tracking-widest font-bold">Mint Network</p>
                        <p className="text-white font-mono mt-0.5 flex items-center justify-end gap-1">
                          Chiliz Chain
                          <span className="material-symbols-outlined text-[12px] text-secondary-brand">open_in_new</span>
                        </p>
                      </div>
                    </div>

                    {/* The story description */}
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest">The Story</h3>
                      <p className="text-sm text-tertiary leading-relaxed font-medium">
                        {selectedMoment.description}
                      </p>
                    </div>

                    <hr className="border-t border-white/5 my-1" />

                    {/* Creator profile card */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={selectedMoment.creator.avatar} alt="Creator avatar" className="w-11 h-11 rounded-full object-cover border border-white/10" />
                        <div>
                          <p className="text-[10px] text-tertiary uppercase tracking-widest font-bold">Creator</p>
                          <p className="text-sm font-bold text-white flex items-center gap-1">
                            @{selectedMoment.creator.username}
                            <span className="material-symbols-outlined text-secondary-brand text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => playSound('click')}
                        className="px-4 py-1.5 rounded-full border border-secondary-brand text-secondary-brand text-xs font-bold active:scale-95 transition-transform"
                      >
                        Follow
                      </button>
                    </div>

                    <hr className="border-t border-white/5 my-1" />

                    {/* Owner Card details */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={selectedMoment.owner.avatar} alt="Owner avatar" className="w-11 h-11 rounded-full object-cover border border-white/10" />
                        <div>
                          <p className="text-[10px] text-tertiary uppercase tracking-widest font-bold">Current Owner</p>
                          <p className="text-sm font-bold text-white">
                            {selectedMoment.owner.username === userWallet.username ? 'You (StadiumKing)' : `@${selectedMoment.owner.username}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-tertiary bg-white/5 py-1 px-3 rounded-full border border-white/5">
                        {selectedMoment.owner.address.slice(0, 8)}...{selectedMoment.owner.address.slice(-6)}
                      </span>
                    </div>

                    {/* Blockchain provenance details */}
                    <section className="glass-panel rounded-2xl p-4 flex flex-col gap-2.5 text-[11px] font-mono">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-body mb-1">On-Chain Ledger</h4>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-tertiary">Tx Hash:</span>
                        <a href="#" className="text-secondary-brand truncate max-w-[200px] hover:underline">{selectedMoment.txnHash}</a>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-tertiary">Contract:</span>
                        <span className="text-white">0x7df4...00eefc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-tertiary">Token Standard:</span>
                        <span className="text-white">ERC-1155 (Chiliz Chain)</span>
                      </div>
                    </section>

                  </div>

                  {/* Sticky Purchase/Buy button bar */}
                  <div className="absolute bottom-0 left-0 w-full p-4 glass-overlay border-t border-white/10 z-40 pb-6 flex items-center justify-between gap-4 select-none">
                    <div>
                      <p className="text-[9px] font-bold text-tertiary uppercase tracking-widest">Trading Value</p>
                      <p className="text-lg font-display font-extrabold text-white mt-0.5">
                        {selectedMoment.price} <span className="text-xs text-tertiary font-bold">{selectedMoment.tokenSymbol}</span>
                      </p>
                      <p className="text-[10px] font-mono text-tertiary">≈ ${(selectedMoment.price * 3.6).toFixed(2)} USD</p>
                    </div>

                    {selectedMoment.owner.username === userWallet.username ? (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-full h-12 px-6 flex items-center justify-center text-green-400 text-xs font-bold uppercase tracking-wider">
                        You Own This Moment
                      </div>
                    ) : buySuccess ? (
                      <div className="bg-green-500 text-black rounded-full h-12 px-6 flex items-center justify-center text-xs font-bold uppercase tracking-wider shadow-lg shadow-green-500/20">
                        Purchased Successfully!
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuyNFT(selectedMoment)}
                        disabled={isBuying}
                        className="bg-primary-brand text-white text-xs font-bold uppercase tracking-widest h-12 px-8 rounded-full box-glow-primary hover:scale-105 active:scale-95 disabled:opacity-50 transition-all font-display"
                      >
                        {isBuying ? 'Relaying Trade...' : 'Buy Moment'}
                      </button>
                    )}
                  </div>

                  {/* Buy Transaction processing spinner overlay */}
                  {isBuying && (
                    <div className="absolute inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-6 text-center">
                      <div className="relative w-16 h-16 mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-primary-brand/20 border-t-primary-brand animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-secondary-brand/10 border-t-secondary-brand animate-spin duration-700"></div>
                      </div>
                      <h3 className="text-headline-md font-display font-extrabold text-white uppercase tracking-wider">Processing Exchange</h3>
                      <p className="text-label-md text-secondary-brand font-mono mt-3 animate-pulse">{buyStatus}</p>
                    </div>
                  )}

                </div>
              )}

            </main>

            {/* Bottom Tab Navigation Bar (Active/Inactive states) */}
            <nav className="flex justify-around items-center px-6 h-20 bg-surface-container/95 border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-40 relative select-none pb-4">
              
              {/* Tab: Marketplace */}
              <button 
                onClick={() => {
                  setMarketTab('FOR_YOU');
                  setScreen('marketplace');
                }}
                className={`flex flex-col items-center justify-center w-12 h-12 hover:text-secondary-brand transition-colors ${screen === 'marketplace' ? 'text-secondary-brand' : 'text-tertiary'}`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: screen === 'marketplace' ? "'FILL' 1" : "'FILL' 0" }}>storefront</span>
              </button>

              {/* Tab: Shutter Camera (Middle - Largest CTA) */}
              <button 
                onClick={() => setScreen('snap')}
                className="flex items-center justify-center bg-primary-brand text-white rounded-full w-14 h-14 -mt-5 shadow-[0_4px_16px_rgba(255,85,64,0.4)] scale-110 active:scale-100 hover:brightness-110 transition-all duration-300 ease-out border-2 border-white/10"
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
              </button>

              {/* Tab: Trending / What's Hot */}
              <button 
                onClick={() => setScreen('trending')}
                className={`flex flex-col items-center justify-center w-12 h-12 hover:text-secondary-brand transition-colors ${screen === 'trending' ? 'text-secondary-brand' : 'text-tertiary'}`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: screen === 'trending' ? "'FILL' 1" : "'FILL' 0" }}>local_fire_department</span>
              </button>

            </nav>
          </>
        )}

      </div>
    </div>
  );
}
