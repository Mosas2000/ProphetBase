export interface TournamentConfig {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  rules: {
    startingBalance: number;
    allowedAssets: string[];
    leverageLimit: number;
  };
}

export interface Participant {
  userId: string;
  currentBalance: number;
  rank: number;
  trades: number;
  pnl: number;
}

export class TradingCompetitionService {
  private tournaments: Map<string, TournamentConfig> = new Map();
  private participants: Map<string, Map<string, Participant>> = new Map();
  private leaderboards: Map<string, Participant[]> = new Map();

  createTournament(config: Omit<TournamentConfig, 'id'>): string {
    const id = `TOURN-${Date.now()}`;
    this.tournaments.set(id, { ...config, id });
    this.participants.set(id, new Map());
    return id;
  }

  registerParticipant(tournamentId: string, userId: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    const tournamentParticipants = this.participants.get(tournamentId);

    if (!tournament || !tournamentParticipants) return false;

    if (tournamentParticipants.size >= tournament.maxParticipants) {
      return false;
    }

    tournamentParticipants.set(userId, {
      userId,
      currentBalance: tournament.rules.startingBalance,
      rank: tournamentParticipants.size + 1,
      trades: 0,
      pnl: 0,
    });

    return true;
  }

  updateParticipantBalance(
    tournamentId: string,
    userId: string,
    newBalance: number
  ): void {
    const tournamentParticipants = this.participants.get(tournamentId);
    const participant = tournamentParticipants?.get(userId);

    if (participant) {
      const tournament = this.tournaments.get(tournamentId);
      participant.currentBalance = newBalance;
      participant.pnl = newBalance - (tournament?.rules.startingBalance || 0);
      participant.trades++;
      this.updateLeaderboard(tournamentId);
    }
  }

  getLeaderboard(tournamentId: string): Participant[] {
    return this.leaderboards.get(tournamentId) || [];
  }

  private updateLeaderboard(tournamentId: string): void {
    const tournamentParticipants = this.participants.get(tournamentId);
    if (!tournamentParticipants) return;

    const sorted = Array.from(tournamentParticipants.values())
      .sort((a, b) => b.currentBalance - a.currentBalance)
      .map((p, index) => ({ ...p, rank: index + 1 }));

    this.leaderboards.set(tournamentId, sorted);
  }

  getPrizeDistribution(tournamentId: string): Record<number, number> {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return {};

    return {
      1: tournament.prizePool * 0.5,
      2: tournament.prizePool * 0.3,
      3: tournament.prizePool * 0.2,
    };
  }
}
