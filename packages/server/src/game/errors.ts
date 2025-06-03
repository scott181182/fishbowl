

export class PlayerNotFoundError extends Error {
    public constructor(public readonly sessionId: string) {
        super(`Could not find Player for session ID '${sessionId}'`);
    }
}

export class TeamNotFoundError extends Error {
    public constructor(public readonly teamId: string) {
        super(`Could not find Team with ID '${teamId}'`);
    }
}
