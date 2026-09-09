export interface Moment {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  category: 'GOAL' | 'SAVE' | 'CELEBRATION' | 'CROWD' | 'TENSION';
  rarity: 'CORE' | 'RARE' | 'EPIC' | 'LEGENDARY';
  price: number;
  tokenSymbol: 'PSG' | 'BAR' | 'ACM' | 'CITY' | 'JUV' | 'ARS' | 'CHZ';
  match: string;
  minute: string;
  location: string;
  creator: {
    username: string;
    avatar: string;
    address: string;
  };
  owner: {
    username: string;
    avatar: string;
    address: string;
  };
  serial: number;
  maxSerial: number;
  timestamp: string;
  txnHash: string;
  tokenId?: string;
  likes: number;
  views: number;
  isListed: boolean;
  isDraft?: boolean;
}

export interface Match {
  id: string;
  teamHome: string;
  teamAway: string;
  teamHomeSymbol: string;
  teamAwaySymbol: string;
  teamHomeLogo: string;
  teamAwayLogo: string;
  scoreHome: number;
  scoreAway: number;
  status: 'LIVE' | 'COMPLETED' | 'UPCOMING';
  time: string;
  activeCapturers: number;
  suggestionTags: string[];
  location: string;
}

export const MOCK_USER = {
  username: 'StadiumKing',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB21Vk8-t8OxW1hY0TSCFg51ZrJM2vUGAalifhd8KW47sO7hXlbRXF2cWPs23C6qc5Wcp9fOkxMWY9IJgmh8hc55DHW4tNvB1j9uwTPP_Knk_szfYzerYg9XA3cFnp4KxOoFaW4x4L3Q0KgH81gll89CVonozuM4ydtgyJHPbKDX73J85ygiRBrp2ccoGOIq8FwR4EGmFNTlNrIDt74niddDIQQDG918x_zbSh_QvZJAPRT-MZYHrZlp_ONYcvGsaLni6H-l5u1B-M',
  address: '0x71C4B...8921df4',
  chzBalance: 450,
  ftBalances: {
    BAR: 1250,
    PSG: 80,
    ACM: 150,
    CITY: 200,
  }
};

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    teamHome: 'Manchester City',
    teamAway: 'Arsenal',
    teamHomeSymbol: 'MCI',
    teamAwaySymbol: 'ARS',
    teamHomeLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQVRNhXUUdGoLBRHqQ5IcJZX4Y1zeZ9MN4VeboVwu8DQaxgqBIau0JW5NTZsODEx0-yopZRVL0UAi7veCL1eTa01xaFiZbAfWMHawz7a_u6QVIw2QZufOb1pTvTAnhvEalCCmz3mWWaTQCx3SFDSXfc6_L5zk-x0Qracl5-lpXdBUTpKptXYTqlDcp09jk2nc949mKOF-27d9JHSwZ0hgIdEJWzuPWRky_oHW8e3qyXGZ3FizdmnmIU2CLdyt6VGEvp-fezH5bShQ',
    teamAwayLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGrXlVTLb4MxMvgt8kSdHi2M9jMaLykBileLseQoPDgingZP_uEuTwycGoP7itWfUDUsBwuBCgkuicLg8qaH82WmEJzBBeWw1r9jobGdPFn3qJvDAdUpzDhCCqBIZG-ub9u2VLBGDP2dHD93o4GilZHZyuzDuhYyq_MPAGqsZTgNid6XwywDvEY1wv6cK6h-bYFa0zg_7TPu-reyjWq-XpNb4RX2TToylesH6gyb-3N8sNy2vpxuiPP6219IZvlC1XcfnpqdfU7nw',
    scoreHome: 2,
    scoreAway: 1,
    status: 'LIVE',
    time: "75'",
    activeCapturers: 12400,
    suggestionTags: ['Goal', 'Celebration', 'Tension', 'Save'],
    location: 'Etihad Stadium'
  },
  {
    id: 'm2',
    teamHome: 'Real Madrid',
    teamAway: 'FC Barcelona',
    teamHomeSymbol: 'RMA',
    teamAwaySymbol: 'FCB',
    teamHomeLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXtk3vrKhvHek1DyFRt4uh_rUGihM0A_HAaYF5D1L5YuRxDk1VxhCcyD3UBb2mgaaWCVL0zdxsBmWsMfVgKG2-YiA2KOeNnbGbyxvEfvG2uSBLqZSEZlUnqZbhBRY_yciRAMhqjru89V68Qplzy9e8O8ijNkm5g3U3YXbV1Dxr4SqFtn0nm915tOKgVFeKTRUvV_sd47iqFkYEEVVtYKf2uBBFKfCX2_3g3TQBNlehsi7tJ9b2KqTaIEZbk5XsOV8Es5uxhYsU38c',
    teamAwayLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvnNfGdW3hL-x3Hq0o-0aV_w9_GSKvbgHxOkq8vZL6EUGI_X9C8WJq27ukImBI37kPZrVSRO2R4sKefW1ZRRvAjLfoBFYsJIeQJqe1idVQ5YDssL9qZnwyVParuI6CFesYd9KxLp07627K9xgJr2-9WhgAXohI-UMIcsd9bXnHDbdYrTssjgbpZvkXDxKem6vhPp4mlKYnkdui1NTWi4i8v0omRpVyD-hxKBhv9OFAaE1C_wgqsMU48ZB-xnkTEKDK4vnd7Z-iRgU',
    scoreHome: 0,
    scoreAway: 0,
    status: 'LIVE',
    time: "40'",
    activeCapturers: 8200,
    suggestionTags: ['Save', 'Foul', 'Tension', 'Counter-Attack'],
    location: 'Santiago Bernabéu'
  },
  {
    id: 'm3',
    teamHome: 'Paris Saint-Germain',
    teamAway: 'AC Milan',
    teamHomeSymbol: 'PSG',
    teamAwaySymbol: 'ACM',
    teamHomeLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvnNfGdW3hL-x3Hq0o-0aV_w9_GSKvbgHxOkq8vZL6EUGI_X9C8WJq27ukImBI37kPZrVSRO2R4sKefW1ZRRvAjLfoBFYsJIeQJqe1idVQ5YDssL9qZnwyVParuI6CFesYd9KxLp07627K9xgJr2-9WhgAXohI-UMIcsd9bXnHDbdYrTssjgbpZvkXDxKem6vhPp4mlKYnkdui1NTWi4i8v0omRpVyD-hxKBhv9OFAaE1C_wgqsMU48ZB-xnkTEKDK4vnd7Z-iRgU', // reusable fallback
    teamAwayLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXtk3vrKhvHek1DyFRt4uh_rUGihM0A_HAaYF5D1L5YuRxDk1VxhCcyD3UBb2mgaaWCVL0zdxsBmWsMfVgKG2-YiA2KOeNnbGbyxvEfvG2uSBLqZSEZlUnqZbhBRY_yciRAMhqjru89V68Qplzy9e8O8ijNkm5g3U3YXbV1Dxr4SqFtn0nm915tOKgVFeKTRUvV_sd47iqFkYEEVVtYKf2uBBFKfCX2_3g3TQBNlehsi7tJ9b2KqTaIEZbk5XsOV8Es5uxhYsU38c',
    scoreHome: 1,
    scoreAway: 1,
    status: 'LIVE',
    time: "88'",
    activeCapturers: 5400,
    suggestionTags: ['Goal', 'Crowd', 'Foul', 'Red Card'],
    location: 'Parc des Princes'
  }
];

export const MOCK_MOMENTS: Moment[] = [
  {
    id: 'mom1',
    title: 'Orange Drinks',
    description: 'Refreshing summer cocktail with an orange slice at the Swipedrinks Festival. Perfect for cooling down!',
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    category: 'GOAL',
    rarity: 'EPIC',
    price: 50,
    tokenSymbol: 'PSG',
    match: 'Swipedrinks Festival',
    minute: "42'",
    location: 'Miami Beach',
    creator: {
      username: 'SummerVibes',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoQWEv1JjL9GDnCFZ_UsPpfINKPwPcDsH5iDRpzlbE6e92Z9MWbMHbKEz9UHheiojwvVcUkc45RQd-5uCJqgM_7SvYl3So5VnkiyTVKWSWQqMCRT0P4t1Pf0RL7T3jb4y4JbB7bAk7uvQryan0hxc3rqu6NZTVHHEF5A29jRptqFdLMpBLOBwzG_7DHmAW7jNhy7Aq05b3QAstPDUc4-KfTgfEDZvXL6gOqQCwQS8r40sFBUWrqnfjHOrK8WOhQFCQYfRU8dgh-Aw',
      address: '0x82f9A...923ad70'
    },
    owner: {
      username: 'SummerVibes',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoQWEv1JjL9GDnCFZ_UsPpfINKPwPcDsH5iDRpzlbE6e92Z9MWbMHbKEz9UHheiojwvVcUkc45RQd-5uCJqgM_7SvYl3So5VnkiyTVKWSWQqMCRT0P4t1Pf0RL7T3jb4y4JbB7bAk7uvQryan0hxc3rqu6NZTVHHEF5A29jRptqFdLMpBLOBwzG_7DHmAW7jNhy7Aq05b3QAstPDUc4-KfTgfEDZvXL6gOqQCwQS8r40sFBUWrqnfjHOrK8WOhQFCQYfRU8dgh-Aw',
      address: '0x82f9A...923ad70'
    },
    serial: 42,
    maxSerial: 1000,
    timestamp: '2026-06-11T14:10:00Z',
    txnHash: '0x3a9b2d8e41103c8c22bbfa4092b3cf7742d8f99e3a39e88d75cf82bb192ac77e',
    likes: 342,
    views: 4500,
    isListed: true
  },
  {
    id: 'mom2',
    title: 'Vintage Kicks',
    description: 'A beautiful pair of vintage sneakers from the 90s.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    category: 'SAVE',
    rarity: 'RARE',
    price: 120,
    tokenSymbol: 'BAR',
    match: 'SneakerCon 2026',
    minute: "89'",
    location: 'London',
    creator: {
      username: 'SneakerHead',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB21Vk8-t8OxW1hY0TSCFg51ZrJM2vUGAalifhd8KW47sO7hXlbRXF2cWPs23C6qc5Wcp9fOkxMWY9IJgmh8hc55DHW4tNvB1j9uwTPP_Knk_szfYzerYg9XA3cFnp4KxOoFaW4x4L3Q0KgH81gll89CVonozuM4ydtgyJHPbKDX73J85ygiRBrp2ccoGOIq8FwR4EGmFNTlNrIDt74niddDIQQDG918x_zbSh_QvZJAPRT-MZYHrZlp_ONYcvGsaLni6H-l5u1B-M',
      address: '0x1c8b9...f239aa8'
    },
    owner: {
      username: 'SneakerHead',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB21Vk8-t8OxW1hY0TSCFg51ZrJM2vUGAalifhd8KW47sO7hXlbRXF2cWPs23C6qc5Wcp9fOkxMWY9IJgmh8hc55DHW4tNvB1j9uwTPP_Knk_szfYzerYg9XA3cFnp4KxOoFaW4x4L3Q0KgH81gll89CVonozuM4ydtgyJHPbKDX73J85ygiRBrp2ccoGOIq8FwR4EGmFNTlNrIDt74niddDIQQDG918x_zbSh_QvZJAPRT-MZYHrZlp_ONYcvGsaLni6H-l5u1B-M',
      address: '0x1c8b9...f239aa8'
    },
    serial: 12,
    maxSerial: 500,
    timestamp: '2026-06-11T13:45:00Z',
    txnHash: '0x8f2d90987c2b55f190e882f0981a2be10c8c0e290fba8c919a3b6e8a71d871d3',
    likes: 512,
    views: 8900,
    isListed: true
  },
  {
    id: 'mom3',
    title: 'Minimal Watch',
    description: 'Clean lines and modern aesthetics. This watch is the perfect daily driver.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    category: 'CROWD',
    rarity: 'LEGENDARY',
    price: 350,
    tokenSymbol: 'BAR',
    match: 'Timepiece Expo',
    minute: 'FT',
    location: 'Geneva',
    creator: {
      username: 'WatchFam',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoQWEv1JjL9GDnCFZ_UsPpfINKPwPcDsH5iDRpzlbE6e92Z9MWbMHbKEz9UHheiojwvVcUkc45RQd-5uCJqgM_7SvYl3So5VnkiyTVKWSWQqMCRT0P4t1Pf0RL7T3jb4y4JbB7bAk7uvQryan0hxc3rqu6NZTVHHEF5A29jRptqFdLMpBLOBwzG_7DHmAW7jNhy7Aq05b3QAstPDUc4-KfTgfEDZvXL6gOqQCwQS8r40sFBUWrqnfjHOrK8WOhQFCQYfRU8dgh-Aw',
      address: '0x9d2e1...83ac0f0'
    },
    owner: {
      username: 'WatchFam',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoQWEv1JjL9GDnCFZ_UsPpfINKPwPcDsH5iDRpzlbE6e92Z9MWbMHbKEz9UHheiojwvVcUkc45RQd-5uCJqgM_7SvYl3So5VnkiyTVKWSWQqMCRT0P4t1Pf0RL7T3jb4y4JbB7bAk7uvQryan0hxc3rqu6NZTVHHEF5A29jRptqFdLMpBLOBwzG_7DHmAW7jNhy7Aq05b3QAstPDUc4-KfTgfEDZvXL6gOqQCwQS8r40sFBUWrqnfjHOrK8WOhQFCQYfRU8dgh-Aw',
      address: '0x9d2e1...83ac0f0'
    },
    serial: 1,
    maxSerial: 100,
    timestamp: '2026-06-11T12:00:00Z',
    txnHash: '0xf8e121da0c228fa8e2bc13d567feab23e0cfa23e12be88df75efba8cf23ad2e9',
    likes: 1205,
    views: 25400,
    isListed: true
  },
  {
    id: 'mom4',
    title: 'Studio Headphones',
    description: 'High fidelity audio for the modern audiophile.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    category: 'GOAL',
    rarity: 'EPIC',
    price: 250,
    tokenSymbol: 'BAR',
    match: 'Tech Meetup',
    minute: "89'",
    location: 'San Francisco',
    creator: {
      username: 'TechEnthusiast',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoQWEv1JjL9GDnCFZ_UsPpfINKPwPcDsH5iDRpzlbE6e92Z9MWbMHbKEz9UHheiojwvVcUkc45RQd-5uCJqgM_7SvYl3So5VnkiyTVKWSWQqMCRT0P4t1Pf0RL7T3jb4y4JbB7bAk7uvQryan0hxc3rqu6NZTVHHEF5A29jRptqFdLMpBLOBwzG_7DHmAW7jNhy7Aq05b3QAstPDUc4-KfTgfEDZvXL6gOqQCwQS8r40sFBUWrqnfjHOrK8WOhQFCQYfRU8dgh-Aw',
      address: '0xMatchdayOfficialAddress'
    },
    owner: {
      username: 'TechEnthusiast',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoQWEv1JjL9GDnCFZ_UsPpfINKPwPcDsH5iDRpzlbE6e92Z9MWbMHbKEz9UHheiojwvVcUkc45RQd-5uCJqgM_7SvYl3So5VnkiyTVKWSWQqMCRT0P4t1Pf0RL7T3jb4y4JbB7bAk7uvQryan0hxc3rqu6NZTVHHEF5A29jRptqFdLMpBLOBwzG_7DHmAW7jNhy7Aq05b3QAstPDUc4-KfTgfEDZvXL6gOqQCwQS8r40sFBUWrqnfjHOrK8WOhQFCQYfRU8dgh-Aw',
      address: '0xMatchdayOfficialAddress'
    },
    serial: 1,
    maxSerial: 10,
    timestamp: '2023-05-28T21:45:00Z',
    txnHash: '0xabcde12345ffeedd88998877aaccbbaa11223344556677889900aabbccddeeff',
    likes: 2400,
    views: 45000,
    isListed: true
  }
];

export const MOCK_MY_CAPTURES: Moment[] = [
  {
    id: 'my1',
    title: 'Bicycle Kick Derby Winner',
    description: 'Breathtaking overhead kick by Haaland to seal the Manchester Derby. Captured directly from Section 102. Stadium went absolute bonkers!',
    imageUrl: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=800&q=80',
    category: 'GOAL',
    rarity: 'EPIC',
    price: 300,
    tokenSymbol: 'CITY',
    match: 'MCI vs ARS',
    minute: "62'",
    location: 'Etihad Stadium',
    creator: {
      username: 'StadiumKing',
      avatar: MOCK_USER.avatar,
      address: MOCK_USER.address
    },
    owner: {
      username: 'StadiumKing',
      avatar: MOCK_USER.avatar,
      address: MOCK_USER.address
    },
    serial: 42,
    maxSerial: 1000,
    timestamp: '2026-06-11T14:15:00Z',
    txnHash: '0x5c90b0e98031fa1a2be10c8c0e290fba8c919a3b6e8a71d871d37c2b55f190e8',
    likes: 84,
    views: 1200,
    isListed: true
  },
  {
    id: 'my2',
    title: 'Crowd Eruption 90+4\'',
    description: 'Real Madrid vs Barcelona - Stadium crowd erupts in celebrations. Confetti raining down and flares lit up inside the stadium.',
    imageUrl: 'https://images.unsplash.com/photo-1558239080-692723c101b0?auto=format&fit=crop&w=800&q=80',
    category: 'CROWD',
    rarity: 'RARE',
    price: 150,
    tokenSymbol: 'BAR',
    match: 'Real Madrid vs Barcelona',
    minute: "90+4'",
    location: 'Santiago Bernabéu',
    creator: {
      username: 'StadiumKing',
      avatar: MOCK_USER.avatar,
      address: MOCK_USER.address
    },
    owner: {
      username: 'StadiumKing',
      avatar: MOCK_USER.avatar,
      address: MOCK_USER.address
    },
    serial: 189,
    maxSerial: 500,
    timestamp: '2026-06-11T13:50:00Z',
    txnHash: '0x6e2a9b2d8e41103c8c22bbfa4092b3cf7742d8f99e3a39e88d75cf82bb192ac77f',
    likes: 35,
    views: 420,
    isListed: false
  }
];

export const SUGGESTED_CHALLENGES = [
  { id: 'c1', title: 'Derby Equalizer', reward: '50 CHZ', match: 'MCI vs ARS', active: true },
  { id: 'c2', title: 'Corner Volley Celebration', reward: '100 CHZ', match: 'PSG vs Milan', active: true },
  { id: 'c3', title: 'Goalkeeper Dive Capture', reward: '200 CHZ', match: 'RMA vs FCB', active: false }
];
