'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'border-red-500';
      case 'warning':
        return 'border-yellow-500';
      default:
        return 'border-blue-500';
    }
  };

  const getIconEmoji = () => {
    switch (variant) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '⚡';
      default:
        return '✓';
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className={`max-w-md w-full border-2 ${getVariantStyles()} shadow-2xl animate-scale-in`}>
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                variant === 'danger' ? 'bg-red-500/20' :
                variant === 'warning' ? 'bg-yellow-500/20' :
                'bg-blue-500/20'
              }`}>
                {getIconEmoji()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-400">{description}</p>
              </div>
            </div>

            {children && (
              <div className="my-4 p-4 bg-gray-800 rounded-lg">
                {children}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
              >
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'error' : 'default'}
                onClick={onConfirm}
                className="flex-1"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

// Transaction Confirmation Dialog
interface TransactionSummary {
  action: string;
  market: string;
  outcome: 'YES' | 'NO';
  amount: number;
  shares: number;
  avgPrice: number;
  fee: number;
  total: number;
}

interface TransactionConfirmProps {
  isOpen: boolean;
  summary: TransactionSummary;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TransactionConfirm({ isOpen, summary, onConfirm, onCancel }: TransactionConfirmProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Confirm Transaction"
      description="Please review your transaction details before confirming"
      confirmText="Confirm Trade"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Action</span>
          <span className="font-medium">{summary.action}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Market</span>
          <span className="font-medium text-sm">{summary.market}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Outcome</span>
          <span className={`font-bold ${summary.outcome === 'YES' ? 'text-green-400' : 'text-red-400'}`}>
            {summary.outcome}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Shares</span>
          <span className="font-medium">{summary.shares}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Avg Price</span>
          <span className="font-medium">{summary.avgPrice}¢</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Trading Fee</span>
          <span className="font-medium">${summary.fee.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-700 pt-3 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">${summary.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 bg-yellow-500/10 border border-yellow-500 rounded-lg p-3">
        <p className="text-sm text-yellow-400">
          ⚠️ This transaction cannot be reversed. Make sure all details are correct.
        </p>
      </div>
    </ConfirmDialog>
  );
}

// Delete Confirmation
interface DeleteConfirmProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirm({ isOpen, itemName, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete Confirmation"
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
