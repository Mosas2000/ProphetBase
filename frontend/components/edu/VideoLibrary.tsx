'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Video {
  id: string;
  title: string;
  duration: string;
  views: number;
  playlist: string;
  completed: boolean;
  thumbnail: string;
}

export function VideoLibrary() {
  const [selectedPlaylist, setSelectedPlaylist] = useState('all');

  const videos: Video[] = [
    { id: '1', title: 'Introduction to ProphetBase', duration: '5:30', views: 12500, playlist: 'basics', completed: true, thumbnail: '📺' },
    { id: '2', title: 'Your First Trade', duration: '8:15', views: 9800, playlist: 'basics', completed: true, thumbnail: '📺' },
    { id: '3', title: 'Understanding Probabilities', duration: '12:45', views: 7200, playlist: 'intermediate', completed: false, thumbnail: '📺' },
    { id: '4', title: 'Advanced Trading Strategies', duration: '15:20', views: 5400, playlist: 'advanced', completed: false, thumbnail: '📺' },
    { id: '5', title: 'Risk Management', duration: '10:30', views: 6800, playlist: 'intermediate', completed: false, thumbnail: '📺' },
    { id: '6', title: 'Market Analysis Tools', duration: '14:00', views: 4200, playlist: 'advanced', completed: false, thumbnail: '📺' },
  ];

  const playlists = [
    { id: 'all', name: 'All Videos', count: videos.length },
    { id: 'basics', name: 'Basics', count: videos.filter(v => v.playlist === 'basics').length },
    { id: 'intermediate', name: 'Intermediate', count: videos.filter(v => v.playlist === 'intermediate').length },
    { id: 'advanced', name: 'Advanced', count: videos.filter(v => v.playlist === 'advanced').length },
  ];

  const filteredVideos = selectedPlaylist === 'all' 
    ? videos 
    : videos.filter(v => v.playlist === selectedPlaylist);

  const watchedCount = videos.filter(v => v.completed).length;
  const totalDuration = videos.reduce((sum, v) => {
    const [min, sec] = v.duration.split(':').map(Number);
    return sum + min * 60 + sec;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Video Library</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Videos Watched</p>
              <p className="text-2xl font-bold">{watchedCount}/{videos.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Duration</p>
              <p className="text-2xl font-bold">{Math.floor(totalDuration / 60)} min</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Progress</p>
              <p className="text-2xl font-bold">{Math.round((watchedCount / videos.length) * 100)}%</p>
            </div>
          </div>

          {/* Playlist Filter */}
          <div className="flex gap-2 flex-wrap">
            {playlists.map(playlist => (
              <button
                key={playlist.id}
                onClick={() => setSelectedPlaylist(playlist.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedPlaylist === playlist.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {playlist.name} ({playlist.count})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVideos.map(video => (
          <Card key={video.id}>
            <div className="p-6">
              <div className="bg-gray-900 rounded-lg p-8 mb-4 flex items-center justify-center relative">
                <span className="text-6xl">{video.thumbnail}</span>
                {video.completed && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <h4 className="font-semibold mb-2">{video.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{video.duration}</span>
                  <span>•</span>
                  <span>{video.views.toLocaleString()} views</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" className="flex-1">
                  {video.completed ? 'Watch Again' : 'Watch Now'}
                </Button>
                <Badge variant="default" className="capitalize">{video.playlist}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Community Uploads */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Community Uploads</h4>
          
          <div className="space-y-3">
            {[
              { title: 'My Trading Strategy Explained', author: 'CryptoKing', views: 3200 },
              { title: 'How I Made $10k in a Month', author: 'TradeQueen', views: 5600 },
            ].map((video, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">📹</span>
                  <div>
                    <p className="font-medium">{video.title}</p>
                    <p className="text-sm text-gray-400">by {video.author} • {video.views.toLocaleString()} views</p>
                  </div>
                </div>
                <Button size="sm">Watch</Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
