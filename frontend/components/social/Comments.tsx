'use client';

import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextArea from '@/components/ui/TextArea';
import { formatDate } from '@/lib/utils/formatDate';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface Comment {
  id: string;
  author: string;
  authorAddress: string;
  content: string;
  timestamp: number;
  likes: number;
  replies: Comment[];
  isLiked: boolean;
}

interface CommentsProps {
  marketId: number;
}

export default function Comments({ marketId }: CommentsProps) {
  const { address } = useAccount();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'CryptoTrader',
      authorAddress: '0x1234...5678',
      content: 'I think YES is undervalued here. Bitcoin has strong momentum.',
      timestamp: Date.now() - 3600000,
      likes: 12,
      replies: [
        {
          id: '1-1',
          author: 'MarketMaker',
          authorAddress: '0x8765...4321',
          content: 'Agreed! The technicals look bullish.',
          timestamp: Date.now() - 1800000,
          likes: 5,
          replies: [],
          isLiked: false,
        },
      ],
      isLiked: false,
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handlePostComment = () => {
    if (!address || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      authorAddress: address,
      content: newComment,
      timestamp: Date.now(),
      likes: 0,
      replies: [],
      isLiked: false,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleReply = (commentId: string) => {
    if (!address || !replyText.trim()) return;

    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: 'You',
      authorAddress: address,
      content: replyText,
      timestamp: Date.now(),
      likes: 0,
      replies: [],
      isLiked: false,
    };

    setComments(comments.map(c => 
      c.id === commentId 
        ? { ...c, replies: [...c.replies, reply] }
        : c
    ));
    setReplyText('');
    setReplyingTo(null);
  };

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(comments.map(c => 
        c.id === parentId
          ? {
              ...c,
              replies: c.replies.map(r =>
                r.id === commentId
                  ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked }
                  : r
              ),
            }
          : c
      ));
    } else {
      setComments(comments.map(c =>
        c.id === commentId
          ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked }
          : c
      ));
    }
  };

  const CommentItem = ({ comment, isReply = false, parentId }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? 'ml-12 mt-3' : ''}`}>
      <div className="flex gap-3">
        <Avatar fallback={comment.author[0]} size="sm" />
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.author}</span>
              <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <button
              onClick={() => handleLike(comment.id, isReply, parentId)}
              className={`flex items-center gap-1 ${comment.isLiked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
            >
              <svg className="w-4 h-4" fill={comment.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {comment.likes}
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-gray-500 hover:text-blue-600"
              >
                Reply
              </button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3">
              <TextArea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={() => handleReply(comment.id)} className="text-sm">
                  Post Reply
                </Button>
                <Button onClick={() => setReplyingTo(null)} variant="secondary" className="text-sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply parentId={comment.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Discussion ({comments.length})</h3>

      {address ? (
        <div className="mb-6">
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts on this market..."
            rows={3}
          />
          <Button onClick={handlePostComment} className="mt-2" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">Connect your wallet to join the discussion</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-center text-gray-500 py-8">No comments yet. Be the first to share your thoughts!</p>
      )}
    </Card>
  );
}
