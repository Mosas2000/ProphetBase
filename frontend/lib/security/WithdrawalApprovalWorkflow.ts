export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  destinationAddress: string;
  createdAt: number;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'cancelled';
  requiredApprovals: number;
  approvals: Approval[];
  coolingOffUntil?: number;
  executedAt?: number;
  rejectedAt?: number;
  rejectionReason?: string;
}

export interface Approval {
  approverId: string;
  approverName: string;
  timestamp: number;
  signature: string;
  comments?: string;
}

export interface WithdrawalLimit {
  userId: string;
  dailyLimit: number;
  monthlyLimit: number;
  requiresApprovalAbove: number;
  multiSigThreshold: number;
}

export interface WhitelistedAddress {
  address: string;
  label: string;
  currency: string;
  addedAt: number;
  addedBy: string;
  verified: boolean;
}

export class WithdrawalApprovalWorkflow {
  private withdrawals: Map<string, WithdrawalRequest> = new Map();
  private limits: Map<string, WithdrawalLimit> = new Map();
  private whitelistedAddresses: Map<string, WhitelistedAddress[]> = new Map();
  private readonly DEFAULT_COOLING_PERIOD = 3600000;

  createWithdrawalRequest(
    userId: string,
    amount: number,
    currency: string,
    destinationAddress: string
  ): WithdrawalRequest {
    const limit = this.limits.get(userId);
    const requiredApprovals = this.calculateRequiredApprovals(amount, limit);

    const request: WithdrawalRequest = {
      id: this.generateRequestId(),
      userId,
      amount,
      currency,
      destinationAddress,
      createdAt: Date.now(),
      status: 'pending',
      requiredApprovals,
      approvals: [],
    };

    if (amount >= (limit?.multiSigThreshold || 10000)) {
      request.coolingOffUntil = Date.now() + this.DEFAULT_COOLING_PERIOD;
    }

    this.withdrawals.set(request.id, request);
    return request;
  }

  private generateRequestId(): string {
    return 'wd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private calculateRequiredApprovals(
    amount: number,
    limit?: WithdrawalLimit
  ): number {
    if (!limit) return 1;

    if (amount >= limit.multiSigThreshold) {
      return 3;
    } else if (amount >= limit.requiresApprovalAbove) {
      return 2;
    }
    return 1;
  }

  approveWithdrawal(
    requestId: string,
    approverId: string,
    approverName: string,
    signature: string,
    comments?: string
  ): { success: boolean; message: string; request?: WithdrawalRequest } {
    const request = this.withdrawals.get(requestId);

    if (!request) {
      return { success: false, message: 'Withdrawal request not found' };
    }

    if (request.status !== 'pending') {
      return {
        success: false,
        message: `Request is already ${request.status}`,
      };
    }

    if (request.approvals.some((a) => a.approverId === approverId)) {
      return {
        success: false,
        message: 'You have already approved this request',
      };
    }

    if (request.coolingOffUntil && Date.now() < request.coolingOffUntil) {
      return {
        success: false,
        message: `Cooling-off period active until ${new Date(
          request.coolingOffUntil
        ).toISOString()}`,
      };
    }

    const approval: Approval = {
      approverId,
      approverName,
      timestamp: Date.now(),
      signature,
      comments,
    };

    request.approvals.push(approval);

    if (request.approvals.length >= request.requiredApprovals) {
      request.status = 'approved';
    }

    return { success: true, message: 'Approval recorded', request };
  }

  rejectWithdrawal(
    requestId: string,
    approverId: string,
    reason: string
  ): { success: boolean; message: string } {
    const request = this.withdrawals.get(requestId);

    if (!request) {
      return { success: false, message: 'Withdrawal request not found' };
    }

    if (request.status !== 'pending') {
      return {
        success: false,
        message: `Request is already ${request.status}`,
      };
    }

    request.status = 'rejected';
    request.rejectedAt = Date.now();
    request.rejectionReason = reason;

    return { success: true, message: 'Withdrawal request rejected' };
  }

  executeWithdrawal(requestId: string): { success: boolean; message: string } {
    const request = this.withdrawals.get(requestId);

    if (!request) {
      return { success: false, message: 'Withdrawal request not found' };
    }

    if (request.status !== 'approved') {
      return {
        success: false,
        message: 'Request must be approved before execution',
      };
    }

    if (
      !this.isAddressWhitelisted(request.userId, request.destinationAddress)
    ) {
      return {
        success: false,
        message: 'Destination address is not whitelisted',
      };
    }

    request.status = 'executed';
    request.executedAt = Date.now();

    return { success: true, message: 'Withdrawal executed successfully' };
  }

  cancelWithdrawal(
    requestId: string,
    userId: string
  ): { success: boolean; message: string } {
    const request = this.withdrawals.get(requestId);

    if (!request) {
      return { success: false, message: 'Withdrawal request not found' };
    }

    if (request.userId !== userId) {
      return { success: false, message: 'Unauthorized' };
    }

    if (request.status === 'executed') {
      return { success: false, message: 'Cannot cancel executed withdrawal' };
    }

    request.status = 'cancelled';

    return { success: true, message: 'Withdrawal cancelled' };
  }

  setWithdrawalLimit(userId: string, limits: WithdrawalLimit): void {
    this.limits.set(userId, limits);
  }

  getWithdrawalLimit(userId: string): WithdrawalLimit | undefined {
    return this.limits.get(userId);
  }

  addWhitelistedAddress(
    userId: string,
    address: string,
    label: string,
    currency: string,
    addedBy: string
  ): WhitelistedAddress {
    const whitelisted: WhitelistedAddress = {
      address,
      label,
      currency,
      addedAt: Date.now(),
      addedBy,
      verified: false,
    };

    const userAddresses = this.whitelistedAddresses.get(userId) || [];
    userAddresses.push(whitelisted);
    this.whitelistedAddresses.set(userId, userAddresses);

    return whitelisted;
  }

  removeWhitelistedAddress(userId: string, address: string): boolean {
    const userAddresses = this.whitelistedAddresses.get(userId) || [];
    const filtered = userAddresses.filter((a) => a.address !== address);

    if (filtered.length < userAddresses.length) {
      this.whitelistedAddresses.set(userId, filtered);
      return true;
    }

    return false;
  }

  isAddressWhitelisted(userId: string, address: string): boolean {
    const userAddresses = this.whitelistedAddresses.get(userId) || [];
    return userAddresses.some((a) => a.address === address && a.verified);
  }

  getWhitelistedAddresses(userId: string): WhitelistedAddress[] {
    return this.whitelistedAddresses.get(userId) || [];
  }

  verifyWhitelistedAddress(userId: string, address: string): boolean {
    const userAddresses = this.whitelistedAddresses.get(userId) || [];
    const addressEntry = userAddresses.find((a) => a.address === address);

    if (addressEntry) {
      addressEntry.verified = true;
      return true;
    }

    return false;
  }

  getPendingWithdrawals(userId: string): WithdrawalRequest[] {
    return Array.from(this.withdrawals.values()).filter(
      (w) => w.userId === userId && w.status === 'pending'
    );
  }

  getWithdrawalHistory(
    userId: string,
    limit: number = 50
  ): WithdrawalRequest[] {
    return Array.from(this.withdrawals.values())
      .filter((w) => w.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }

  getWithdrawalsAwaitingApproval(approverId: string): WithdrawalRequest[] {
    return Array.from(this.withdrawals.values()).filter(
      (w) =>
        w.status === 'pending' &&
        !w.approvals.some((a) => a.approverId === approverId)
    );
  }
}
