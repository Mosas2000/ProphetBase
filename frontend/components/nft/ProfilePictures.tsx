'use client';

import {
  Camera,
  Check,
  Download,
  Palette,
  Save,
  Shuffle,
  Sparkles,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface Trait {
  category: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  icon: string;
  color: string;
}

interface ProfileNFT {
  id: string;
  name: string;
  traits: {
    background: Trait;
    body: Trait;
    eyes: Trait;
    mouth: Trait;
    accessory: Trait;
    special: Trait | null;
  };
  rarity: number;
  owned: boolean;
  equipped: boolean;
  price: number;
  tokenId: string | null;
}

interface GeneratorOptions {
  background: Trait[];
  body: Trait[];
  eyes: Trait[];
  mouth: Trait[];
  accessory: Trait[];
  special: Trait[];
}

export default function ProfilePictures() {
  const [currentProfile, setCurrentProfile] = useState<ProfileNFT | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedTraitCategory, setSelectedTraitCategory] =
    useState<string>('background');

  const generatorOptions: GeneratorOptions = {
    background: [
      {
        category: 'background',
        name: 'Cosmic Purple',
        rarity: 'common',
        icon: '🌌',
        color: '#6B21A8',
      },
      {
        category: 'background',
        name: 'Ocean Blue',
        rarity: 'common',
        icon: '🌊',
        color: '#1E40AF',
      },
      {
        category: 'background',
        name: 'Forest Green',
        rarity: 'uncommon',
        icon: '🌲',
        color: '#065F46',
      },
      {
        category: 'background',
        name: 'Golden Sunset',
        rarity: 'rare',
        icon: '🌅',
        color: '#D97706',
      },
      {
        category: 'background',
        name: 'Diamond Matrix',
        rarity: 'legendary',
        icon: '💎',
        color: '#0EA5E9',
      },
    ],
    body: [
      {
        category: 'body',
        name: 'Classic Avatar',
        rarity: 'common',
        icon: '👤',
        color: '#E5E7EB',
      },
      {
        category: 'body',
        name: 'Bull Trader',
        rarity: 'uncommon',
        icon: '🐂',
        color: '#10B981',
      },
      {
        category: 'body',
        name: 'Bear Analyst',
        rarity: 'uncommon',
        icon: '🐻',
        color: '#EF4444',
      },
      {
        category: 'body',
        name: 'Crypto Punk',
        rarity: 'rare',
        icon: '🤖',
        color: '#8B5CF6',
      },
      {
        category: 'body',
        name: 'Legendary Ape',
        rarity: 'legendary',
        icon: '🦧',
        color: '#F59E0B',
      },
    ],
    eyes: [
      {
        category: 'eyes',
        name: 'Normal Eyes',
        rarity: 'common',
        icon: '👁️',
        color: '#FFFFFF',
      },
      {
        category: 'eyes',
        name: 'Laser Eyes',
        rarity: 'uncommon',
        icon: '👀',
        color: '#EF4444',
      },
      {
        category: 'eyes',
        name: 'Diamond Eyes',
        rarity: 'rare',
        icon: '💎',
        color: '#3B82F6',
      },
      {
        category: 'eyes',
        name: 'Rainbow Vision',
        rarity: 'legendary',
        icon: '🌈',
        color: '#EC4899',
      },
    ],
    mouth: [
      {
        category: 'mouth',
        name: 'Smile',
        rarity: 'common',
        icon: '😊',
        color: '#FFFFFF',
      },
      {
        category: 'mouth',
        name: 'Cool Shades',
        rarity: 'uncommon',
        icon: '😎',
        color: '#000000',
      },
      {
        category: 'mouth',
        name: 'Money Mouth',
        rarity: 'rare',
        icon: '🤑',
        color: '#10B981',
      },
      {
        category: 'mouth',
        name: 'Golden Grill',
        rarity: 'legendary',
        icon: '👄',
        color: '#F59E0B',
      },
    ],
    accessory: [
      {
        category: 'accessory',
        name: 'None',
        rarity: 'common',
        icon: '⚪',
        color: '#6B7280',
      },
      {
        category: 'accessory',
        name: 'Trader Hat',
        rarity: 'uncommon',
        icon: '🎩',
        color: '#000000',
      },
      {
        category: 'accessory',
        name: 'Crown',
        rarity: 'rare',
        icon: '👑',
        color: '#F59E0B',
      },
      {
        category: 'accessory',
        name: 'Halo',
        rarity: 'legendary',
        icon: '😇',
        color: '#FBBF24',
      },
    ],
    special: [
      {
        category: 'special',
        name: 'None',
        rarity: 'common',
        icon: '',
        color: '#6B7280',
      },
      {
        category: 'special',
        name: 'Sparkles',
        rarity: 'uncommon',
        icon: '✨',
        color: '#FBBF24',
      },
      {
        category: 'special',
        name: 'Fire Aura',
        rarity: 'rare',
        icon: '🔥',
        color: '#EF4444',
      },
      {
        category: 'special',
        name: 'Lightning',
        rarity: 'legendary',
        icon: '⚡',
        color: '#FBBF24',
      },
    ],
  };

  const [savedProfiles, setSavedProfiles] = useState<ProfileNFT[]>([
    {
      id: '1',
      name: 'Bull Market King',
      traits: {
        background: generatorOptions.background[4],
        body: generatorOptions.body[4],
        eyes: generatorOptions.eyes[3],
        mouth: generatorOptions.mouth[3],
        accessory: generatorOptions.accessory[3],
        special: generatorOptions.special[3],
      },
      rarity: 99.9,
      owned: true,
      equipped: true,
      price: 5000,
      tokenId: '0x1a2b3c',
    },
    {
      id: '2',
      name: 'Crypto Analyst',
      traits: {
        background: generatorOptions.background[1],
        body: generatorOptions.body[3],
        eyes: generatorOptions.eyes[1],
        mouth: generatorOptions.mouth[1],
        accessory: generatorOptions.accessory[1],
        special: null,
      },
      rarity: 65.4,
      owned: true,
      equipped: false,
      price: 850,
      tokenId: '0x4d5e6f',
    },
  ]);

  const [customProfile, setCustomProfile] = useState<{
    background: Trait;
    body: Trait;
    eyes: Trait;
    mouth: Trait;
    accessory: Trait;
    special: Trait | null;
  }>({
    background: generatorOptions.background[0],
    body: generatorOptions.body[0],
    eyes: generatorOptions.eyes[0],
    mouth: generatorOptions.mouth[0],
    accessory: generatorOptions.accessory[0],
    special: null,
  });

  const generateRandom = () => {
    setIsGenerating(true);

    setTimeout(() => {
      setCustomProfile({
        background:
          generatorOptions.background[
            Math.floor(Math.random() * generatorOptions.background.length)
          ],
        body: generatorOptions.body[
          Math.floor(Math.random() * generatorOptions.body.length)
        ],
        eyes: generatorOptions.eyes[
          Math.floor(Math.random() * generatorOptions.eyes.length)
        ],
        mouth:
          generatorOptions.mouth[
            Math.floor(Math.random() * generatorOptions.mouth.length)
          ],
        accessory:
          generatorOptions.accessory[
            Math.floor(Math.random() * generatorOptions.accessory.length)
          ],
        special:
          Math.random() > 0.7
            ? generatorOptions.special[
                Math.floor(Math.random() * generatorOptions.special.length)
              ]
            : null,
      });
      setIsGenerating(false);
    }, 500);
  };

  const calculateRarity = (traits: any) => {
    const rarityScores = {
      common: 1,
      uncommon: 5,
      rare: 15,
      legendary: 50,
    };

    let totalScore = 0;
    Object.values(traits).forEach((trait: any) => {
      if (trait) {
        totalScore += rarityScores[trait.rarity];
      }
    });

    return Math.min(100, (totalScore / 6) * 1.5);
  };

  const saveProfile = () => {
    const newProfile: ProfileNFT = {
      id: Date.now().toString(),
      name: `Profile ${savedProfiles.length + 1}`,
      traits: customProfile,
      rarity: calculateRarity(customProfile),
      owned: false,
      equipped: false,
      price: 0,
      tokenId: null,
    };

    setSavedProfiles([...savedProfiles, newProfile]);
    alert('Profile saved! You can mint it as an NFT.');
  };

  const mintProfile = async (profile: ProfileNFT) => {
    // Simulate minting
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSavedProfiles((prev) =>
      prev.map((p) =>
        p.id === profile.id
          ? { ...p, owned: true, tokenId: `0x${Date.now().toString(16)}` }
          : p
      )
    );
  };

  const equipProfile = (profileId: string) => {
    setSavedProfiles((prev) =>
      prev.map((p) => ({
        ...p,
        equipped: p.id === profileId,
      }))
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30';
      case 'rare':
        return 'text-purple-400 bg-purple-600/20 border-purple-500/30';
      case 'uncommon':
        return 'text-blue-400 bg-blue-600/20 border-blue-500/30';
      default:
        return 'text-slate-400 bg-slate-600/20 border-slate-500/30';
    }
  };

  const selectTrait = (trait: Trait) => {
    setCustomProfile({
      ...customProfile,
      [selectedTraitCategory]: trait,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl">
              <User className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                NFT Profile Pictures
              </h1>
              <p className="text-slate-400">
                Create unique avatars with trait-based generative art
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => {
              setShowGenerator(!showGenerator);
              setShowGallery(false);
            }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all"
          >
            <Palette className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-bold text-lg mb-1">Avatar Generator</h3>
            <p className="text-sm text-slate-400">
              Create your unique profile NFT
            </p>
          </button>

          <button
            onClick={() => {
              setShowGallery(!showGallery);
              setShowGenerator(false);
            }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all"
          >
            <Camera className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-bold text-lg mb-1">My Gallery</h3>
            <p className="text-sm text-slate-400">
              {savedProfiles.length} profiles saved
            </p>
          </button>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <Sparkles className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="font-bold text-lg mb-1">Current Profile</h3>
            <p className="text-sm text-slate-400">
              {savedProfiles.find((p) => p.equipped)?.name ||
                'No profile equipped'}
            </p>
          </div>
        </div>

        {/* Generator Section */}
        {showGenerator && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Avatar Generator</h2>
              <div className="flex gap-2">
                <button
                  onClick={generateRandom}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Shuffle className="w-4 h-4" />
                  Randomize
                </button>
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview */}
              <div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 border border-slate-700">
                  <div
                    className="w-full aspect-square rounded-xl flex flex-col items-center justify-center text-center relative"
                    style={{ backgroundColor: customProfile.background.color }}
                  >
                    <div className="text-8xl mb-4">
                      {customProfile.body.icon}
                    </div>
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-6xl">
                      {customProfile.eyes.icon}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-6xl">
                      {customProfile.mouth.icon}
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl">
                      {customProfile.accessory.icon}
                    </div>
                    {customProfile.special && (
                      <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-30">
                        {customProfile.special.icon}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <div className="text-sm text-slate-400 mb-1">
                      Rarity Score
                    </div>
                    <div className="text-2xl font-bold">
                      {calculateRarity(customProfile).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Trait Selector */}
              <div>
                <div className="mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                      'background',
                      'body',
                      'eyes',
                      'mouth',
                      'accessory',
                      'special',
                    ].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedTraitCategory(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                          selectedTraitCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {generatorOptions[
                    selectedTraitCategory as keyof GeneratorOptions
                  ]?.map((trait: Trait) => (
                    <button
                      key={trait.name}
                      onClick={() => selectTrait(trait)}
                      className={`w-full p-4 rounded-lg border transition-all ${
                        customProfile[
                          selectedTraitCategory as keyof typeof customProfile
                        ]?.name === trait.name
                          ? 'border-blue-500 bg-blue-600/20'
                          : 'border-slate-700 bg-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{trait.icon}</div>
                          <div className="text-left">
                            <div className="font-semibold">{trait.name}</div>
                            <div
                              className={`text-xs px-2 py-1 rounded inline-block ${getRarityColor(
                                trait.rarity
                              )}`}
                            >
                              {trait.rarity}
                            </div>
                          </div>
                        </div>
                        {customProfile[
                          selectedTraitCategory as keyof typeof customProfile
                        ]?.name === trait.name && (
                          <Check className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {showGallery && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-6">My Profile Gallery</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-slate-700/50 rounded-xl border border-slate-600 overflow-hidden"
                >
                  <div
                    className="w-full aspect-square flex flex-col items-center justify-center relative"
                    style={{ backgroundColor: profile.traits.background.color }}
                  >
                    <div className="text-6xl mb-3">
                      {profile.traits.body.icon}
                    </div>
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-4xl">
                      {profile.traits.eyes.icon}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-4xl">
                      {profile.traits.mouth.icon}
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl">
                      {profile.traits.accessory.icon}
                    </div>
                    {profile.traits.special && (
                      <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
                        {profile.traits.special.icon}
                      </div>
                    )}

                    {profile.equipped && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-green-600/80 rounded-full text-xs font-semibold">
                        Equipped
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{profile.name}</h3>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-slate-400">Rarity</div>
                        <div className="font-semibold">
                          {profile.rarity.toFixed(1)}%
                        </div>
                      </div>
                      {profile.tokenId && (
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Token ID</div>
                          <div className="text-xs font-mono">
                            {profile.tokenId.slice(0, 8)}...
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {profile.owned ? (
                        <>
                          {!profile.equipped && (
                            <button
                              onClick={() => equipProfile(profile.id)}
                              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Equip Profile
                            </button>
                          )}
                          <button className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => mintProfile(profile)}
                          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                        >
                          Mint as NFT
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">
                About Profile NFTs
              </h3>
              <p className="text-sm text-slate-300">
                Create unique profile pictures using our trait-based generative
                system. Each combination has a rarity score based on trait
                rarity. Mint your favorite designs as NFTs and use them as your
                profile picture across the platform. Some traits are exclusive
                to high-performing traders!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
